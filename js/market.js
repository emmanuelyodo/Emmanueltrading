// ═══════════════════════════════════════════════
// EMMANUEL TRADING — Market Module
// Real-time price simulation & utilities
// ═══════════════════════════════════════════════

window.ET = window.ET || {};
var ET = window.ET;

ET.Market = {
  prices: {},
  callbacks: [],
  intervalId: null,

  init() {
    // Copy initial prices
    this.prices = JSON.parse(JSON.stringify(ET.DATA.marketPrices));
    this._startSimulation();
  },

  _startSimulation() {
    this.intervalId = setInterval(() => {
      this._updatePrices();
      this.callbacks.forEach(cb => cb(this.prices));
    }, 3000);
  },

  _updatePrices() {
    const volatility = { 'EUR/USD': 0.0008, 'GBP/USD': 0.0012, 'XAU/USD': 0.80, 'USD/JPY': 0.15, 'USD/XOF': 0.40 };
    for (const pair in this.prices) {
      const v = volatility[pair] || 0.001;
      const move = (Math.random() - 0.495) * v;
      this.prices[pair].ask += move;
      this.prices[pair].bid = this.prices[pair].ask - (pair === 'XAU/USD' ? 0.40 : 0.0002);
      this.prices[pair].change += move;
      this.prices[pair].changePct = (this.prices[pair].change / (this.prices[pair].ask - this.prices[pair].change)) * 100;
      // Format
      if (pair === 'XAU/USD') {
        this.prices[pair].ask = Math.round(this.prices[pair].ask * 100) / 100;
        this.prices[pair].bid = Math.round(this.prices[pair].bid * 100) / 100;
      } else if (pair === 'USD/JPY') {
        this.prices[pair].ask = Math.round(this.prices[pair].ask * 100) / 100;
        this.prices[pair].bid = Math.round(this.prices[pair].bid * 100) / 100;
      } else if (pair === 'USD/XOF') {
        this.prices[pair].ask = Math.round(this.prices[pair].ask * 10) / 10;
        this.prices[pair].bid = Math.round(this.prices[pair].bid * 10) / 10;
      } else {
        this.prices[pair].ask = Math.round(this.prices[pair].ask * 100000) / 100000;
        this.prices[pair].bid = Math.round(this.prices[pair].bid * 100000) / 100000;
      }
    }
  },

  onUpdate(cb) {
    this.callbacks.push(cb);
    return () => { this.callbacks = this.callbacks.filter(c => c !== cb); };
  },

  formatPrice(pair, price) {
    if (pair === 'XAU/USD' || pair === 'USD/XOF' || pair === 'USD/JPY') {
      return price.toFixed(2);
    }
    return price.toFixed(5);
  },

  formatChange(change, pair) {
    const decimals = (pair === 'XAU/USD' || pair === 'USD/XOF' || pair === 'USD/JPY') ? 2 : 5;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(decimals)}`;
  },

  formatChangePct(pct) {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  },

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.callbacks = [];
  }
};

// ─── Countdown Timer ────────────────────────────
ET.Countdown = {
  targetTime: null,
  intervalId: null,

  getNextEvent() {
    const now = new Date();
    const upcoming = ET.DATA.econCalendar
      .map(e => {
        const [h, m] = e.time.split(':');
        const d = new Date(e.date);
        d.setHours(parseInt(h), parseInt(m), 0, 0);
        return { ...e, datetime: d };
      })
      .filter(e => e.datetime > now)
      .sort((a, b) => a.datetime - b.datetime);
    return upcoming[0] || null;
  },

  getTimeLeft(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, total: diff };
  },

  formatCountdown(event) {
    if (!event) return '--:--:--';
    const tl = this.getTimeLeft(event.datetime);
    if (tl.h > 0) return `${tl.h}h ${String(tl.m).padStart(2,'0')}min`;
    return `${String(tl.m).padStart(2,'0')}:${String(tl.s).padStart(2,'0')}`;
  },

  // Time of day greeting
  getGreeting(firstName = '') {
    const h = new Date().getHours();
    const name = firstName ? ` ${firstName}` : '';
    if (h < 12) {
      return { greeting: `Bonjour${name} 👋`, sub: 'Bonne séance de trading ce matin.' };
    } else if (h < 17) {
      const nextEvent = this.getNextEvent();
      if (nextEvent) {
        const tl = this.getTimeLeft(nextEvent.datetime);
        const timeStr = tl.h > 0 ? `${tl.h}h ${tl.m}min` : `${tl.m} minutes`;
        return { greeting: `Bonjour${name} 👋`, sub: `La session américaine ouvre dans ${timeStr}.` };
      }
      return { greeting: `Bonjour${name} 👋`, sub: 'Bonne session de trading cet après-midi.' };
    } else if (h < 22) {
      return { greeting: `Bonsoir${name} 👋`, sub: 'Bonne analyse du marché ce soir.' };
    }
    return { greeting: `Bonsoir${name} 👋`, sub: 'Prenez soin de votre capital.' };
  }
};
