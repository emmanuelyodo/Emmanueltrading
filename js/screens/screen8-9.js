// ═══════════════════════════════════════════════
// SCREENS: Coaching (8) + Payments (9)
// ═══════════════════════════════════════════════

// ─── SCREEN 8: COACHING ──────────────────────
ET.Screens.coaching = {
  selectedDate: null,
  selectedSlot: null,
  currentMonth: new Date(),

  render() {
    const el = document.getElementById('screen-coaching');
    el.innerHTML = `
      <div class="screen-content no-nav">
        <div class="coaching-hero">
          <div class="coach-avatar-big">🎯</div>
          <h1 style="font-family:var(--font-display);font-size:24px;font-weight:800;color:#fff;margin-bottom:var(--sp-2)">Coaching Individuel</h1>
          <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;max-width:300px;margin:0 auto var(--sp-4)">
            Sessions personnalisées d'1 heure avec Emmanuel pour accélérer votre progression
          </p>
          <div style="display:flex;gap:var(--sp-3);justify-content:center;flex-wrap:wrap">
            <div style="background:rgba(255,255,255,.1);border-radius:var(--radius-full);padding:8px 16px;font-size:13px;color:#fff;display:flex;align-items:center;gap:6px">
              ${ET.svgIcon('clock',14,'rgba(255,255,255,.8)')} 60 min / session
            </div>
            <div style="background:rgba(212,160,23,.2);border:1px solid rgba(212,160,23,.3);border-radius:var(--radius-full);padding:8px 16px;font-size:13px;color:var(--gold);font-weight:700">
              15 000 – 30 000 FCFA
            </div>
          </div>
        </div>

        <div style="padding:var(--sp-4)">
          <!-- What's included -->
          <div class="section-title mb-3">Ce qui est inclus</div>
          <div class="card mb-4">
            <div class="card-body">
              ${[
                { icon: 'target', text: 'Analyse personnalisée de votre profil de trading' },
                { icon: 'fileText', text: 'Revue complète de votre journal de trading' },
                { icon: 'trending', text: 'Stratégie adaptée à votre style et objectifs' },
                { icon: 'shield', text: 'Plan d\'action concret post-session' },
              ].map(item => `
                <div style="display:flex;align-items:center;gap:var(--sp-3);padding:10px 0;border-bottom:1px solid var(--border)">
                  <div class="icon-wrap-sm icon-gold">${ET.svgIcon(item.icon, 16)}</div>
                  <span style="font-size:14px;color:var(--text-secondary)">${item.text}</span>
                </div>
              `).join('').replace(/<\/div>\s*<div style="display:flex[^>]*>([^<]*)<\/div>\s*<\/div>\s*$/, '</div></div>')}
              <div style="display:flex;align-items:center;gap:var(--sp-3);padding:10px 0">
                <div class="icon-wrap-sm icon-gold">${ET.svgIcon('video', 16)}</div>
                <span style="font-size:14px;color:var(--text-secondary)">Session en visio (Zoom ou Google Meet)</span>
              </div>
            </div>
          </div>

          <!-- Calendar -->
          <div class="section-title mb-3">Réserver une session</div>
          <div class="card mb-4">
            <div class="card-body">
              <!-- Month nav -->
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-4)">
                <button class="btn-ghost btn-sm btn" onclick="ET.Screens.coaching.prevMonth()">${ET.svgIcon('arrowLeft',16)}</button>
                <div style="font-weight:800;font-size:15px" id="month-label"></div>
                <button class="btn-ghost btn-sm btn" onclick="ET.Screens.coaching.nextMonth()">${ET.svgIcon('arrowRight',16)}</button>
              </div>
              <!-- Day headers -->
              <div class="calendar-grid">
                ${['L','M','M','J','V','S','D'].map(d => `<div class="cal-header-day">${d}</div>`).join('')}
              </div>
              <!-- Calendar days -->
              <div class="calendar-grid mt-2" id="cal-grid"></div>
            </div>
          </div>

          <!-- Time Slots -->
          <div id="slots-section" style="display:none">
            <div class="section-title mb-3">Créneaux disponibles</div>
            <div id="slots-list"></div>
          </div>

          <!-- History -->
          <div class="section-title mb-3 mt-2">Mes sessions passées</div>
          <div class="card">
            ${ET.DATA.coachingSessions.map(s => `
              <div style="padding:var(--sp-4);border-bottom:1px solid var(--border)">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-2)">
                  <div>
                    <div style="font-weight:700;font-size:14px">${ET.formatDateShort(s.date)}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${s.time} · ${s.duration}min</div>
                  </div>
                  <span class="badge badge-green">Terminée</span>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.5">${s.notes}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    ET.Router.go('coaching');
    this._buildCalendar();
  },

  _buildCalendar() {
    const now = new Date();
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const label = document.getElementById('month-label');
    if (label) label.textContent = `${monthNames[month]} ${year}`;
    const grid = document.getElementById('cal-grid');
    if (!grid) return;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;

    let html = '';
    for (let i = 0; i < startOffset; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const hasSlots = ET.DATA.coachingSlots[dateStr]?.length > 0;
      const isPast = new Date(year, month, d) < new Date(now.toDateString());
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const isSelected = dateStr === this.selectedDate;
      let cls = 'cal-day';
      if (isPast) cls += ' past';
      else if (hasSlots) cls += ' available';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';
      html += `<div class="${cls}" onclick="ET.Screens.coaching.selectDate('${dateStr}')">${d}</div>`;
    }
    grid.innerHTML = html;
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this._buildCalendar();
    const slots = ET.DATA.coachingSlots[dateStr] || [];
    const section = document.getElementById('slots-section');
    const list = document.getElementById('slots-list');
    if (!section || !list) return;
    if (slots.length === 0) {
      section.style.display = 'none';
      ET.toast.show('Aucun créneau disponible ce jour', 'warning');
      return;
    }
    section.style.display = 'block';
    list.innerHTML = slots.map(t => `
      <div class="time-slot available ${this.selectedSlot===t?'selected':''}" onclick="ET.Screens.coaching.selectSlot('${t}')">
        <div style="display:flex;align-items:center;gap:var(--sp-2)">
          ${ET.svgIcon('clock', 16, this.selectedSlot===t?'var(--gold)':'var(--text-secondary)')}
          <span>${t}</span>
        </div>
        ${this.selectedSlot===t
          ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();ET.Screens.coaching._bookSession()">Réserver</button>`
          : `<span style="font-size:12px;color:var(--green)">Disponible</span>`
        }
      </div>
    `).join('');
  },

  selectSlot(time) {
    this.selectedSlot = time;
    this.selectDate(this.selectedDate);
  },

  _bookSession() {
    if (!this.selectedDate || !this.selectedSlot) return;
    ET.Router.go('payments');
    ET.Screens.payments.render('coaching');
    ET.toast.show(`Créneau sélectionné : ${this.selectedDate} à ${this.selectedSlot}`, 'success');
  },

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this._buildCalendar();
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const label = document.getElementById('month-label');
    if (label) label.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  },

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this._buildCalendar();
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const label = document.getElementById('month-label');
    if (label) label.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }
};


// ─── SCREEN 9: PAYMENTS ──────────────────────
ET.Screens.payments = {
  activeTab: 'plans',
  selectedPlan: null,
  selectedMethod: null,
  paymentContext: null,

  render(context = 'plans') {
    this.paymentContext = context;
    const u = ET.Auth.currentUser;
    const el = document.getElementById('screen-payments');
    el.innerHTML = `
      <div class="app-header">
        ${ET.svgIcon('creditCard', 22, 'var(--blue-dark)')}
        <div style="flex:1;margin-left:var(--sp-2)">
          <div style="font-family:var(--font-display);font-weight:800;font-size:16px">Paiements</div>
          <div style="font-size:11px;color:var(--green)">Plan actuel : ${this._planName(u?.plan || 'essentiel')}</div>
        </div>
      </div>
      <div class="screen-content">
        <!-- Tabs -->
        <div style="padding:var(--sp-3) var(--sp-4) 0">
          <div class="tabs">
            <div class="tab-btn ${this.activeTab==='plans'?'active':''}" onclick="ET.Screens.payments.setTab('plans')">Offres</div>
            <div class="tab-btn ${this.activeTab==='history'?'active':''}" onclick="ET.Screens.payments.setTab('history')">Historique</div>
            <div class="tab-btn ${this.activeTab==='referral'?'active':''}" onclick="ET.Screens.payments.setTab('referral')">Parrainage</div>
          </div>
        </div>
        <div id="payments-content" style="padding:var(--sp-4)">
          ${this._renderTab(this.activeTab)}
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.tabs .tab-btn').forEach((b, i) => {
      b.classList.toggle('active', i === ['plans','history','referral'].indexOf(tab));
    });
    document.getElementById('payments-content').innerHTML = this._renderTab(tab);
  },

  _renderTab(tab) {
    if (tab === 'plans') return this._renderPlans();
    if (tab === 'history') return this._renderHistory();
    if (tab === 'referral') return this._renderReferral();
    return '';
  },

  _renderPlans() {
    const u = ET.Auth.currentUser;
    const currentPlan = u?.plan || 'essentiel';
    return `
      <div style="margin-bottom:var(--sp-4);padding:var(--sp-3);background:rgba(26,122,74,.08);border:1px solid rgba(26,122,74,.2);border-radius:var(--radius-md)">
        <div style="font-size:13px;color:var(--green);font-weight:600">✅ Plan actuel : ${this._planName(currentPlan)}</div>
        ${currentPlan==='premium' ? '<div style="font-size:12px;color:var(--text-muted);margin-top:2px">Renouvellement le 1 mai 2026 · 7 500 FCFA</div>' : ''}
      </div>
      ${ET.DATA.plans.map(p => `
        <div class="pricing-card mb-4 ${p.featured?'featured':''}" style="${p.id===currentPlan?'border-color:var(--green)':''}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-4)">
            <div class="pricing-name">${p.name}</div>
            ${p.id===currentPlan ? `<span class="badge badge-green">Actif</span>` : ''}
          </div>
          <div class="pricing-price">
            ${p.price === 0 ? '<span style="font-size:20px">Gratuit</span>' : ET.formatFCFA(p.price)}
          </div>
          <div class="pricing-period">${p.period}</div>
          <div class="pricing-features">
            ${p.features.map(f => `
              <div class="pricing-feature">
                <span class="pricing-feature-icon">${ET.svgIcon('check', 14, 'var(--green)')}</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn ${p.featured?'btn-primary':'btn-secondary'} btn-block ${p.disabled||p.id===currentPlan?'':'hover:shadow-gold'}"
            ${p.disabled||p.id===currentPlan?'disabled':''} 
            onclick="ET.Screens.payments._openPaymentModal('${p.id}','${p.price}','${p.name}')">
            ${p.id===currentPlan?'Plan actuel':p.cta}
          </button>
        </div>
      `).join('')}
    `;
  },

  _renderHistory() {
    return `
      <div class="card">
        ${ET.DATA.transactions.map(t => `
          <div class="transaction-item">
            <div class="tx-icon" style="background:${t.type==='credit'?'rgba(26,122,74,.1)':'rgba(26,74,122,.1)'}">
              ${t.type==='credit' ? ET.svgIcon('trending',18,'var(--green)') : ET.svgIcon('creditCard',18,'var(--blue-mid)')}
            </div>
            <div class="tx-info">
              <div class="tx-name">${t.name}</div>
              <div class="tx-date">${ET.formatDateShort(t.date)} · ${t.method}</div>
            </div>
            <div>
              <div class="tx-amount ${t.type==='credit'?'tx-positive':'tx-negative'}">
                ${t.type==='credit'?'+':''}${ET.formatFCFA(t.amount)}
              </div>
              <div style="text-align:right;margin-top:2px">
                <span class="badge badge-green" style="font-size:9px">${t.status==='success'?'✓ Confirmé':'En attente'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-block mt-4" onclick="ET.toast.show('Export CSV disponible en production','info')">
        ${ET.svgIcon('download',16)} Exporter en CSV
      </button>
    `;
  },

  _renderReferral() {
    const u = ET.Auth.currentUser;
    const code = u?.referralCode || 'ET00DEMO';
    return `
      <div class="referral-code-box mb-4">
        <div style="position:relative">
          <div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:var(--sp-2)">Votre code de parrainage</div>
          <div class="referral-code">${code}</div>
          <p style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:var(--sp-4)">
            Partagez ce code et gagnez <strong style="color:var(--gold)">15%</strong> de commission sur chaque achat
          </p>
          <div style="display:flex;gap:var(--sp-3);justify-content:center">
            <button class="btn btn-sm" style="background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.2)" 
              onclick="navigator.clipboard.writeText('${code}').then(()=>ET.toast.show('Code copié !','success'))">
              ${ET.svgIcon('copy',14,'#fff')} Copier
            </button>
            <button class="btn btn-sm" style="background:rgba(37,211,102,.2);color:#25D366;border:1px solid rgba(37,211,102,.3)"
              onclick="window.open('https://wa.me/?text=Rejoignez%20Emmanuel%20Trading%20avec%20mon%20code%20${code}%20!','_blank')">
              ${ET.svgIcon('whatsapp',14,'#25D366')} WhatsApp
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row mb-4">
        <div class="stat-item">
          <div class="stat-value">3</div>
          <div class="stat-label">Filleuls</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">4 500</div>
          <div class="stat-label">FCFA gagnés</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">1 500</div>
          <div class="stat-label">En attente</div>
        </div>
      </div>

      <div class="section-title mb-3">Mes filleuls</div>
      <div class="card">
        ${[
          { name:'Kofi A.', date:'22 mar. 2026', amount:4500, status:'payé' },
          { name:'Aïcha T.', date:'15 mar. 2026', amount:1125, status:'en attente' },
        ].map(f => `
          <div style="display:flex;align-items:center;gap:var(--sp-3);padding:var(--sp-4);border-bottom:1px solid var(--border)">
            <div class="avatar avatar-sm">${f.name[0]}</div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px">${f.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${f.date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;color:${f.status==='payé'?'var(--green)':'var(--text-muted)'};font-size:14px">+${ET.formatFCFA(f.amount)}</div>
              <div style="font-size:11px;color:var(--text-muted)">${f.status}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <button class="btn btn-primary btn-block mt-4" onclick="ET.toast.show('Retrait vers Wave — disponible en production','info')">
        ${ET.svgIcon('send',16,'currentColor')} Retirer mes commissions (Wave)
      </button>
    `;
  },

  _openPaymentModal(planId, price, planName) {
    if (price == 0) return;
    this.selectedPlan = { id: planId, price: parseInt(price), name: planName };
    this.selectedMethod = null;

    const overlay = document.getElementById('payment-modal');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-title">Paiement — ${planName}</div>
        <div style="margin-bottom:var(--sp-4);padding:var(--sp-3);background:var(--bg-light);border-radius:var(--radius-md)">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:14px;color:var(--text-muted)">Offre ${planName}</span>
            <span style="font-weight:700">${ET.formatFCFA(parseInt(price))}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;color:var(--text-muted)">TVA incluse</span>
            <span style="font-size:12px;color:var(--text-muted)">—</span>
          </div>
        </div>

        <div class="section-title mb-3">Mode de paiement</div>
        ${[
          { id:'wave',  logo:'Wave',  cls:'pm-wave',  name:'Wave Money',         desc:'Togo, CI, Sénégal' },
          { id:'flooz', logo:'Flooz', cls:'pm-flooz', name:'Flooz (Moov Africa)', desc:'Togo' },
          { id:'tmoney',logo:'T-$',   cls:'pm-tmoney',name:'T-Money (Togocel)',   desc:'Togo' },
          { id:'card',  logo:'VISA',  cls:'pm-card',  name:'Carte bancaire',      desc:'Visa / Mastercard' },
          { id:'bank',  logo:'BNQ',   cls:'pm-bank',  name:'Virement bancaire',   desc:'Coordonnées affichées' },
        ].map(m => `
          <div class="payment-method-item ${this.selectedMethod===m.id?'selected':''}" id="pm-${m.id}" onclick="ET.Screens.payments.selectMethod('${m.id}')">
            <div class="payment-method-logo ${m.cls}">${m.logo}</div>
            <div class="payment-method-info">
              <div class="payment-method-name">${m.name}</div>
              <div class="payment-method-desc">${m.desc}</div>
            </div>
            ${this.selectedMethod===m.id ? ET.svgIcon('check',18,'var(--gold)') : ''}
          </div>
        `).join('')}

        <button class="btn btn-primary btn-block btn-lg mt-4" id="pay-confirm-btn" onclick="ET.Screens.payments._confirmPayment()" ${!this.selectedMethod?'disabled':''}>
          Confirmer le paiement — ${ET.formatFCFA(parseInt(price))}
        </button>
        <button class="btn btn-ghost btn-block mt-2" onclick="ET.Screens.payments.closeModal()">Annuler</button>
      </div>
    `;
    overlay.classList.add('active');
  },

  selectMethod(methodId) {
    this.selectedMethod = methodId;
    document.querySelectorAll('.payment-method-item').forEach(el => {
      el.classList.toggle('selected', el.id === `pm-${methodId}`);
    });
    const btn = document.getElementById('pay-confirm-btn');
    if (btn) btn.disabled = false;
    const checkIcon = ET.svgIcon('check', 18, 'var(--gold)');
    document.querySelectorAll('.payment-method-item').forEach(el => {
      const existing = el.querySelector('svg:last-child');
      if (existing) existing.remove();
      if (el.id === `pm-${methodId}`) {
        el.insertAdjacentHTML('beforeend', checkIcon);
      }
    });
    if (methodId === 'bank') {
      ET.toast.show('Banque : ECOBANK Togo — IBAN : TG00 1234 5678 9012 3456 7890', 'info', 5000);
    }
  },

  async _confirmPayment() {
    const btn = document.getElementById('pay-confirm-btn');
    if (!btn || !this.selectedMethod) return;
    
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Traitement…';

    try {
      // Create transaction entry locally (optimistic)
      const tx = {
        id: `TX_${Date.now()}`,
        name: this.paymentContext === 'coaching' ? 'Session Coaching' : this.selectedPlan.name,
        amount: this.selectedPlan.price,
        date: new Date().toISOString(),
        method: this.selectedMethod.toUpperCase(),
        status: 'success', // Simulated success
        type: 'debit'
      };

      // Call Backend API
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: this.selectedPlan.price,
          method: this.selectedMethod,
          product: tx.name
        })
      });
      
      const result = await response.json();

      setTimeout(() => {
        this.closeModal();
        ET.toast.show(`Paiement réussi via ${this.selectedMethod.toUpperCase()} ✅`, 'success', 4000);
        
        // Update Local User State
        if (ET.Auth.currentUser) {
          if (this.paymentContext === 'plans') {
            ET.Auth.updateProfile({ plan: this.selectedPlan.id });
          }
          // Add to local history
          ET.DATA.transactions.unshift(tx);
          
          // Re-render history if active
          if (this.activeTab === 'history') this.setTab('history');
        }
      }, 1500);

    } catch (err) {
      console.error('Payment Error:', err);
      ET.toast.show('Erreur de communication avec le serveur de paiement', 'error');
      btn.disabled = false;
      btn.textContent = 'Réessayer';
    }
  },

  closeModal() {
    const overlay = document.getElementById('payment-modal');
    overlay.classList.remove('active');
  },

  _planName(planId) {
    const names = { essentiel: 'Essentiel (Gratuit)', premium: 'Premium', elite: 'Élite', formation: 'Formation' };
    return names[planId] || planId;
  }
};
