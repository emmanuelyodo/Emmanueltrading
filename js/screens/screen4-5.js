// ═══════════════════════════════════════════════
// SCREENS: Dashboard (4) + Formations (5)
// ═══════════════════════════════════════════════

// ─── SCREEN 4: DASHBOARD ──────────────────────
ET.Screens.dashboard = {
  marketUnsubscribe: null,
  countdownInterval: null,

  render() {
    const u = ET.Auth.currentUser;
    const greet = ET.Countdown.getGreeting(u?.firstName);
    const nextEvent = ET.Countdown.getNextEvent();
    const stats = u?.stats || {};

    const el = document.getElementById('screen-dashboard');
    el.innerHTML = `
      ${this._header(u)}
      <div class="screen-content" id="dashboard-content">
        <!-- Welcome Banner -->
        <div class="welcome-banner">
          <div class="welcome-greeting">${greet.greeting}</div>
          <div class="welcome-sub">${greet.sub}</div>
          ${u?.plan === 'premium' || u?.plan === 'elite' ? `<div class="welcome-session-badge">${ET.svgIcon('zap', 12, 'var(--gold)')} Abonnement Premium actif</div>` : ''}
        </div>

        <!-- Parcours -->
        <div class="dashboard-section mt-4">
          <div class="section-header">
            <span class="section-title">Mon parcours</span>
            <span class="section-link" onclick="ET.Router.go('formations');ET.Screens.formations.render()">Voir tout</span>
          </div>
          ${u?.stats?.currentFormation ? `
          <div class="parcours-card" onclick="ET.Screens.formations.openDetail('${u.stats.currentFormation}')">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-3)">
              <div>
                <div class="parcours-module-name">Forex de A à Z — Module ${this._currentModuleNum(stats)}</div>
                <div style="font-size:12px;color:var(--text-muted)">Module en cours : ${this._currentModuleName(stats)}</div>
              </div>
              <div class="parcours-percent">${stats.progress || 0}%</div>
            </div>
            <div class="progress mb-3">
              <div class="progress-bar" style="width:${stats.progress || 0}%"></div>
            </div>
            <button class="btn btn-primary btn-sm">
              Continuer ${ET.svgIcon('arrowRight', 14, 'currentColor')}
            </button>
          </div>
          ` : `
          <div class="parcours-card empty" onclick="ET.Router.go('formations');ET.Screens.formations.render()">
            <div style="text-align:center;padding:var(--sp-4)">
              <div style="font-size:32px;margin-bottom:var(--sp-2)">🚀</div>
              <div style="font-weight:700;margin-bottom:var(--sp-1)">Prêt à devenir trader ?</div>
              <p style="font-size:12px;color:var(--text-muted);margin-bottom:var(--sp-3)">Choisissez votre première formation</p>
              <button class="btn btn-primary btn-sm">Découvrir le catalogue</button>
            </div>
          </div>
          `}
        </div>

        <!-- Market Ticker -->
        <div class="dashboard-section">
          <div class="section-header">
            <span class="section-title">Marchés</span>
            <span class="section-link" onclick="ET.Router.go('analyses');ET.Screens.analyses.render()">Analyses</span>
          </div>
          <div class="market-ticker" id="market-ticker">
            ${this._renderTicker(ET.Market.prices)}
          </div>
        </div>

        <!-- Economic Event -->
        ${nextEvent ? `
        <div class="dashboard-section">
          <div class="section-header"><span class="section-title">Prochain événement</span></div>
          <div class="econ-event-card">
            <div>
              <div class="econ-event-name">${nextEvent.name}</div>
              <div class="econ-event-pair">${nextEvent.pair} · Impact ${nextEvent.impact === 'high' ? 'élevé 🔴' : nextEvent.impact === 'medium' ? 'moyen 🟡' : 'faible 🟢'}</div>
            </div>
            <div class="countdown-display">
              <div class="countdown-time" id="countdown-display">${ET.Countdown.formatCountdown(nextEvent)}</div>
              <div class="countdown-label">Avant l'événement</div>
            </div>
          </div>
        </div>` : ''}

        <!-- Quick Access -->
        <div class="dashboard-section">
          <div class="section-header"><span class="section-title">Accès rapide</span></div>
          <div class="quick-access-grid">
            ${[
              { icon: 'book',     label: 'Formations', color: 'icon-blue',  action: "ET.Router.go('formations');ET.Screens.formations.render()" },
              { icon: 'users',    label: 'Communauté', color: 'icon-gold',  action: "ET.Router.go('community');ET.Screens.community.render()" },
              { icon: 'chart',    label: 'Analyses',   color: 'icon-green', action: "ET.Router.go('analyses');ET.Screens.analyses.render()" },
              { icon: 'target',   label: 'Coaching',   color: 'icon-red',   action: "ET.Router.go('coaching');ET.Screens.coaching.render()" },
              { icon: 'creditCard',label: 'Paiements', color: 'icon-blue',  action: "ET.Router.go('payments');ET.Screens.payments.render()" },
              { icon: 'user',     label: 'Profil',     color: 'icon-dark',  action: "ET.Router.go('profile');ET.Screens.profile.render()" },
            ].map(item => `
              <div class="quick-access-item" onclick="${item.action}">
                <div class="icon-wrap ${item.color}">${ET.svgIcon(item.icon, 22)}</div>
                <span class="quick-access-label">${item.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Last Analysis -->
        <div class="dashboard-section">
          <div class="section-header">
            <span class="section-title">Dernière analyse</span>
            <span class="section-link" onclick="ET.Router.go('analyses');ET.Screens.analyses.render()">Toutes</span>
          </div>
          ${this._renderLastAnalysis()}
        </div>
      </div>
    `;

    this._startCountdown(nextEvent);
    this._subscribeMarket();
  },

  _header(u) {
    const unreadCount = ET.DATA.notifications.filter(n => !n.read).length;
    return `
      <div class="app-header">
        <div class="header-logo">
          <div class="header-logo-mark"></div>
          <span class="header-logo-text font-display">Emmanuel <span>Trading</span></span>
        </div>
        <div class="header-actions">
          <button class="header-btn" onclick="ET.Router.go('notifications');ET.Screens.notifications.render()" id="hdr-notif-btn">
            ${ET.svgIcon('bell', 18)}
            ${unreadCount > 0 ? `<span class="notif-badge">${unreadCount}</span>` : ''}
          </button>
          <button class="header-btn" onclick="ET.Router.go('profile');ET.Screens.profile.render()">
            <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dark));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:var(--blue-dark)">
              ${ET.Auth.getInitials()}
            </div>
          </button>
        </div>
      </div>
    `;
  },

  _renderTicker(prices) {
    return ['EUR/USD','GBP/USD','XAU/USD'].map(pair => {
      const p = prices[pair];
      if (!p) return '';
      const isUp = p.change >= 0;
      return `
        <div class="ticker-item">
          <div>
            <div class="ticker-pair">${pair}</div>
            <div style="font-size:11px;color:var(--text-muted)">${pair === 'XAU/USD' ? 'Or / USD' : 'Forex'}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
            <div class="ticker-price">${ET.Market.formatPrice(pair, p.ask)}</div>
            <div class="ticker-change ${isUp ? 'up' : 'down'}">
              ${isUp ? ET.svgIcon('trending', 12, 'var(--green)') : ET.svgIcon('trendingDown', 12, 'var(--red)')}
              ${ET.Market.formatChangePct(p.changePct)}
            </div>
          </div>
        </div>`;
    }).join('');
  },

  _renderLastAnalysis() {
    const a = ET.DATA.analyses[0];
    const biasMap = { bullish: { cls: 'bias-bullish', txt: '↑ HAUSSIER' }, bearish: { cls: 'bias-bearish', txt: '↓ BAISSIER' }, neutral: { cls: 'bias-neutral', txt: '→ NEUTRE' } };
    const bias = biasMap[a.bias];
    return `
      <div class="analysis-card" onclick="ET.Screens.analyses.openDetail('${a.id}')">
        <div class="analysis-card-header">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div class="analysis-pair">${a.pair}</div>
            <span class="badge badge-gratuit">${a.access === 'free' ? 'GRATUIT' : 'PREMIUM'}</span>
          </div>
          <div class="analysis-date">${ET.formatDateShort(a.date)}</div>
        </div>
        <div class="analysis-card-body">
          <div style="font-weight:700;font-size:15px;margin-bottom:8px;line-height:1.4">${a.title}</div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:var(--sp-3);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.summary}</p>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span class="bias-tag ${bias.cls}">${bias.txt}</span>
            <span style="font-size:13px;color:var(--gold);font-weight:600">Lire ${ET.svgIcon('arrowRight', 13, 'var(--gold)')}</span>
          </div>
        </div>
      </div>`;
  },

  _subscribeMarket() {
    if (this.marketUnsubscribe) this.marketUnsubscribe();
    this.marketUnsubscribe = ET.Market.onUpdate((prices) => {
      const ticker = document.getElementById('market-ticker');
      if (ticker && ET.Router.current === 'dashboard') {
        ticker.innerHTML = this._renderTicker(prices);
      }
    });
  },

  _startCountdown(event) {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (!event) return;
    this.countdownInterval = setInterval(() => {
      const el = document.getElementById('countdown-display');
      if (el && ET.Router.current === 'dashboard') {
        el.textContent = ET.Countdown.formatCountdown(event);
      }
    }, 1000);
  },

  _currentModuleNum(stats) {
    const mods = { m1:1,m2:2,m3:3,m4:4,m5:5,m6:6 };
    return mods[stats.currentModule] || 1;
  },

  _currentModuleName(stats) {
    const f = ET.DATA.formations.find(f => f.id === stats.currentFormation);
    if (!f) return 'Module 1';
    const m = f.modules.find(m => m.id === stats.currentModule);
    return m ? m.title : 'Module 1';
  }
};


// ─── SCREEN 5: FORMATIONS ─────────────────────
ET.Screens.formations = {
  activeFilter: 'all',
  currentFormation: null,
  currentModule: null,
  currentLesson: null,
  quizAnswers: {},
  quizSubmitted: false,

  render() {
    const el = document.getElementById('screen-formations');
    el.innerHTML = `
      <div class="app-header">
        <div style="display:flex;align-items:center;gap:var(--sp-3)">
          <div class="header-logo-mark" style="width:32px;height:32px;background:linear-gradient(135deg,var(--blue-dark),var(--blue-mid));border-radius:8px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
            <span style="color:#fff;font-weight:900;font-family:var(--font-display);font-size:18px;position:relative;z-index:1">E</span>
            <div style="position:absolute;top:0;right:0;width:10px;height:10px;background:var(--gold);border-radius:0 0 0 6px"></div>
          </div>
          <span class="header-logo-text font-display" style="font-size:16px;font-weight:800;color:var(--text-primary)">Formations <span style="color:var(--gold)"></span></span>
        </div>
        <button class="header-btn" onclick="ET.toast.show('Recherche bientôt disponible','info')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
      <div class="screen-content">
        <div style="padding:var(--sp-4) var(--sp-4) 0">
          <h2 style="font-family:var(--font-display);font-size:22px;font-weight:800;margin-bottom:4px">Nos formations</h2>
          <p style="font-size:13px;color:var(--text-muted)">Construisez des bases solides étape par étape</p>
        </div>
        <!-- Filters -->
        <div style="padding:var(--sp-3) var(--sp-4)">
          <div class="chips">
            ${[['all','Toutes'],['debutant','Débutant'],['intermediaire','Intermédiaire'],['avance','Avancé']].map(([v,l]) => `
              <div class="chip ${this.activeFilter===v?'active':''}" onclick="ET.Screens.formations.filter('${v}')">${l}</div>
            `).join('')}
          </div>
        </div>
        <!-- Formation Cards -->
        <div style="padding:0 var(--sp-4)" id="formations-list">
          ${this._renderCards()}
        </div>
      </div>
    `;
  },

  filter(val) {
    this.activeFilter = val;
    document.getElementById('formations-list').innerHTML = this._renderCards();
    document.querySelectorAll('.chips .chip').forEach((c, i) => {
      const vals = ['all','debutant','intermediaire','avance'];
      c.classList.toggle('active', vals[i] === val);
    });
  },

  _renderCards() {
    const filtered = ET.DATA.formations.filter(f => {
      if (this.activeFilter === 'all') return true;
      return f.level.toLowerCase().replace('é','e').replace('è','e') === this.activeFilter;
    });
    return filtered.map(f => this._formationCard(f)).join('');
  },

  _formationCard(f) {
    const isPurchased = ET.Auth.currentUser?.stats?.currentFormation === f.id;
    const isComingSoon = f.status === 'coming-soon';
    return `
      <div class="formation-card mb-4" onclick="ET.Screens.formations.openDetail('${f.id}')">
        <div class="formation-card-thumb" style="background:linear-gradient(135deg,${f.color},${f.color}99)">
          <div style="font-size:52px;position:relative;z-index:1">${f.icon}</div>
          ${isComingSoon ? `<div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:var(--radius-full);padding:3px 10px;font-size:11px;font-weight:700;backdrop-filter:blur(8px)">BIENTÔT</div>` : ''}
          ${isPurchased ? `<div style="position:absolute;top:12px;right:12px;background:var(--green);color:#fff;border-radius:var(--radius-full);padding:3px 10px;font-size:11px;font-weight:700">INSCRIT</div>` : ''}
        </div>
        <div class="formation-card-body">
          <div class="formation-card-title">${f.title}</div>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:var(--sp-3);line-height:1.5">${f.subtitle}</p>
          <div class="formation-card-meta">
            <span class="badge ${f.level==='Débutant'?'level-debutant':f.level==='Intermédiaire'?'level-intermediaire':'level-avance'}">${f.level}</span>
            ${!isComingSoon ? `<span class="badge badge-muted">${ET.svgIcon('clock',10,'currentColor')} ${f.duration}</span>` : ''}
            ${f.enrolled ? `<span class="badge badge-muted">${ET.svgIcon('users',10,'currentColor')} ${f.enrolled}</span>` : ''}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--sp-2)">
            ${isComingSoon
              ? `<span style="font-size:13px;color:var(--text-muted)">En cours de création</span>`
              : `<span style="font-size:17px;font-weight:800;font-family:var(--font-display);color:var(--blue-dark)">${ET.formatFCFA(f.price)}</span>`
            }
            <span style="font-size:13px;color:var(--gold);font-weight:600">
              ${isComingSoon ? "M'alerter " : isPurchased ? "Continuer " : "Voir "}
              ${ET.svgIcon('arrowRight', 13, 'var(--gold)')}
            </span>
          </div>
        </div>
      </div>`;
  },

  openDetail(formationId) {
    this.currentFormation = ET.DATA.formations.find(f => f.id === formationId);
    if (!this.currentFormation) return;
    const f = this.currentFormation;
    const el = document.getElementById('screen-formations');
    const isPurchased = ET.Auth.currentUser?.stats?.currentFormation === f.id;
    const isComingSoon = f.status === 'coming-soon';

    el.innerHTML = `
      <div class="back-btn" style="position:absolute;top:16px;left:var(--sp-4);z-index:10;color:rgba(255,255,255,.8)" onclick="ET.Screens.formations.render()">
        ${ET.svgIcon('arrowLeft', 20, 'rgba(255,255,255,.8)')} Retour
      </div>
      <div class="screen-content no-nav" style="padding-bottom:100px">
        <div class="formation-detail-hero" style="padding-top:56px">
          <div style="font-size:48px;margin-bottom:var(--sp-3)">${f.icon}</div>
          <div class="formation-hero-title">${f.title}</div>
          <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;margin-bottom:var(--sp-4)">${f.description}</p>
          <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
            <span class="badge badge-muted" style="background:rgba(255,255,255,.15);color:#fff;border:none">${f.level}</span>
            <span class="badge badge-muted" style="background:rgba(255,255,255,.15);color:#fff;border:none">${ET.svgIcon('clock',12,'rgba(255,255,255,.8)')} ${f.duration}</span>
            ${f.enrolled ? `<span class="badge badge-muted" style="background:rgba(255,255,255,.15);color:#fff;border:none">${ET.svgIcon('users',12,'rgba(255,255,255,.8)')} ${f.enrolled} inscrits</span>` : ''}
          </div>
        </div>

        <div style="padding:var(--sp-4)">
          ${isComingSoon ? `
            <div class="card" style="margin-bottom:var(--sp-4)">
              <div class="card-body" style="text-align:center;padding:var(--sp-6)">
                <div style="font-size:48px;margin-bottom:var(--sp-3)">🚀</div>
                <h3 style="font-weight:800;margin-bottom:var(--sp-2)">Formation en cours de création</h3>
                <p style="color:var(--text-muted);font-size:14px;margin-bottom:var(--sp-4)">Soyez alerté en priorité à la sortie</p>
                <button class="btn btn-primary btn-block" onclick="ET.toast.show('Vous serez alerté à la sortie !','success')">
                  ${ET.svgIcon('bell',16,'currentColor')} M'alerter à la sortie
                </button>
              </div>
            </div>
          ` : `
            <!-- Modules -->
            <div class="section-header mb-3">
              <span class="section-title">Programme (${f.modules.length} modules)</span>
            </div>
            ${f.modules.map(m => `
              <div class="card mb-3" onclick="ET.Screens.formations.openModule('${m.id}')">
                <div class="card-body" style="display:flex;align-items:center;gap:var(--sp-3)">
                  <div class="icon-wrap icon-blue" style="font-size:18px;font-weight:800;font-family:var(--font-display);color:var(--blue-mid);background:rgba(26,74,122,.1)">
                    ${m.order}
                  </div>
                  <div style="flex:1">
                    <div style="font-weight:700;font-size:14px;margin-bottom:2px">${m.title}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${m.lessons.length} leçons · ${m.duration}</div>
                  </div>
                  ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
                </div>
              </div>
            `).join('')}

            <!-- Testimonials -->
            ${f.testimonials?.length ? `
              <div class="section-header mb-3 mt-4">
                <span class="section-title">Avis des apprenants</span>
              </div>
              ${f.testimonials.map(t => `
                <div class="card mb-3">
                  <div class="card-body">
                    <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:var(--sp-2)">
                      <div class="avatar avatar-sm">${t.name[0]}</div>
                      <div>
                        <div style="font-weight:700;font-size:13px">${t.name}</div>
                        <div style="font-size:11px;color:var(--text-muted)">${t.city}</div>
                      </div>
                      <div style="margin-left:auto;display:flex;gap:2px">
                        ${[...Array(t.rating)].map(() => ET.svgIcon('star',12,'#D4A017')).join('')}
                      </div>
                    </div>
                    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;font-style:italic">"${t.text}"</p>
                  </div>
                </div>
              `).join('')}
            ` : ''}
          `}
        </div>
      </div>

      ${!isComingSoon ? `
      <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:var(--bg-card);border-top:1px solid var(--border);padding:var(--sp-4);z-index:100">
        ${isPurchased
          ? (ET.Auth.currentUser.stats.progress === 100 
              ? `<button class="btn btn-primary btn-block btn-lg" style="background:linear-gradient(135deg,var(--gold),var(--gold-dark));color:var(--blue-dark)" onclick="ET.generateCertificate('${ET.Auth.getFullName()}', '${f.title}')">
                  ${ET.svgIcon('award',16,'var(--blue-dark)')} Télécharger mon Certificat
                </button>`
              : `<button class="btn btn-primary btn-block btn-lg" onclick="ET.Screens.formations.openModule('${ET.Auth.currentUser.stats.currentModule || 'm1'}')">
                  ${ET.svgIcon('play',16,'currentColor')} Continuer la formation
                </button>`
            )
          : `<div style="display:flex;align-items:center;gap:var(--sp-3)">
              <div>
                <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">${ET.formatFCFA(f.price)}</div>
                <div style="font-size:11px;color:var(--text-muted)">Accès à vie · Certificat inclus</div>
              </div>
              <button class="btn btn-primary flex-1 btn-lg" onclick="ET.Router.go('payments');ET.Screens.payments.render('formation')">
                Acheter la formation
              </button>
            </div>`
        }
      </div>` : ''}
    `;
    ET.Router.go('formation-detail');
  },

  openModule(moduleId) {
    if (!this.currentFormation) return;
    this.currentModule = this.currentFormation.modules.find(m => m.id === moduleId);
    if (!this.currentModule) return;
    const m = this.currentModule;
    const f = this.currentFormation;
    const el = document.getElementById('screen-formations');

    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Screens.formations.openDetail('${f.id}')">
          ${ET.svgIcon('arrowLeft', 20)} Retour
        </div>
        <span style="font-weight:700;font-size:14px;color:var(--text-muted)">Module ${m.order}/6</span>
      </div>
      <div class="screen-content">
        <div style="padding:var(--sp-4)">
          <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;margin-bottom:4px">${m.title}</h2>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:var(--sp-4)">${m.lessons.length} leçons · ${m.duration}</p>

          <!-- Progress bar module -->
          <div style="margin-bottom:var(--sp-4)">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:12px;color:var(--text-muted)">Progression du module</span>
              <span style="font-size:12px;font-weight:700;color:var(--green)">${m.lessons.filter(l => ET.Auth.getLessonDone(l.id)).length}/${m.lessons.length}</span>
            </div>
            <div class="progress">
              <div class="progress-bar" style="width:${(m.lessons.filter(l => ET.Auth.getLessonDone(l.id)).length/m.lessons.length*100).toFixed(0)}%"></div>
            </div>
          </div>

          <!-- Lessons List -->
          <div class="card">
            ${m.lessons.map((l, idx) => {
              const done = ET.Auth.getLessonDone(l.id);
              const icons = { video: 'video', pdf: 'fileText', quiz: 'helpCircle' };
              const iconColors = { video: 'icon-blue', pdf: 'icon-red', quiz: 'icon-gold' };
              return `
                <div class="lesson-item" onclick="ET.Screens.formations.openLesson('${l.id}')">
                  <div class="lesson-check ${done ? 'done' : ''}">
                    ${done ? ET.svgIcon('check', 12, '#fff') : `<span style="font-size:11px;font-weight:700;color:var(--text-muted)">${idx+1}</span>`}
                  </div>
                  <div class="icon-wrap-sm ${iconColors[l.type] || 'icon-blue'}" style="width:30px;height:30px;border-radius:6px">
                    ${ET.svgIcon(icons[l.type] || 'play', 14)}
                  </div>
                  <div class="lesson-info">
                    <div class="lesson-title ${done ? 'text-muted' : ''}">${l.title}</div>
                    <div class="lesson-meta">
                      <span>${l.type === 'video' ? '🎬' : l.type === 'pdf' ? '📄' : '❓'} ${l.type === 'video' ? 'Vidéo' : l.type === 'pdf' ? 'PDF' : 'Quiz'}</span>
                      <span>·</span>
                      <span>${l.duration}</span>
                    </div>
                  </div>
                  ${done ? `<span style="color:var(--green)">${ET.svgIcon('check', 16, 'var(--green)')}</span>` : ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    ET.Router.go('module-detail');
  },

  openLesson(lessonId) {
    const lesson = this.currentModule?.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    this.currentLesson = lesson;
    const el = document.getElementById('screen-formations');

    if (lesson.type === 'quiz') {
      this._renderQuiz(el, lesson);
    } else if (lesson.type === 'video') {
      this._renderVideo(el, lesson);
    } else {
      this._renderPDF(el, lesson);
    }
  },

  _renderVideo(el, lesson) {
    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Screens.formations.openModule('${this.currentModule.id}')">
          ${ET.svgIcon('arrowLeft', 20)} ${this.currentModule.title}
        </div>
      </div>
      <!-- Video Player -->
      <div class="video-player-wrap" style="background:linear-gradient(135deg,#0a1628,#0d2137)">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:var(--sp-4)">
          <div style="width:70px;height:70px;background:rgba(212,160,23,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid rgba(212,160,23,.4)" onclick="ET.toast.show('Lecture de la vidéo…','info')">
            ${ET.svgIcon('play', 28, '#D4A017')}
          </div>
          <div style="text-align:center">
            <div style="color:#fff;font-weight:700;font-size:15px">${lesson.title}</div>
            <div style="color:rgba(255,255,255,.5);font-size:13px">${lesson.duration}</div>
          </div>
        </div>
        <div class="video-controls">
          <button style="color:#fff;display:flex;align-items:center;gap:6px" onclick="ET.toast.show('Envoi vers Vimeo/Bunny.net en production','info')">
            ${ET.svgIcon('play', 16, '#fff')}
          </button>
          <div style="flex:1;height:3px;background:rgba(255,255,255,.2);border-radius:2px">
            <div style="width:30%;height:100%;background:var(--gold);border-radius:2px"></div>
          </div>
          <button class="speed-btn" onclick="ET.toast.show('Vitesse x1.5','info')">x1</button>
        </div>
      </div>

      <div class="screen-content" style="padding-top:var(--sp-4)">
        <div style="padding:0 var(--sp-4) 100px">
          <h2 style="font-size:18px;font-weight:800;margin-bottom:var(--sp-2)">${lesson.title}</h2>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:var(--sp-4)">${lesson.duration} · Module ${this.currentModule.order} · ${this.currentFormation.title}</p>

          <div class="card mb-4">
            <div class="card-body">
              <h4 style="font-weight:700;margin-bottom:var(--sp-2)">Points clés de cette leçon</h4>
              <ul style="padding-left:16px;color:var(--text-secondary);font-size:14px;line-height:1.9">
                <li>Définition et concepts fondamentaux</li>
                <li>Application pratique sur graphiques réels</li>
                <li>Exemples concrets du marché Forex</li>
                <li>Exercices de mise en pratique</li>
              </ul>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="ET.Screens.formations._completeLesson('${lesson.id}')">
            ${ET.svgIcon('check', 16, 'currentColor')} Marquer comme terminé
          </button>
        </div>
      </div>
    `;
  },

  _renderPDF(el, lesson) {
    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Screens.formations.openModule('${this.currentModule.id}')">
          ${ET.svgIcon('arrowLeft', 20)} ${this.currentModule.title}
        </div>
      </div>
      <div class="screen-content">
        <div style="padding:var(--sp-5) var(--sp-4)">
          <div style="text-align:center;padding:var(--sp-8);background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border);margin-bottom:var(--sp-4)">
            <div style="font-size:64px;margin-bottom:var(--sp-3)">📄</div>
            <h3 style="font-weight:800;margin-bottom:var(--sp-2)">${lesson.title}</h3>
            <p style="color:var(--text-muted);font-size:14px;margin-bottom:var(--sp-4)">Document PDF de référence — ${this.currentModule.title}</p>
            <button class="btn btn-primary" onclick="ET.toast.show('Téléchargement disponible en production','info')">
              ${ET.svgIcon('download', 16, 'currentColor')} Télécharger le PDF
            </button>
          </div>
          <button class="btn btn-secondary btn-block" onclick="ET.Screens.formations._completeLesson('${lesson.id}')">
            ${ET.svgIcon('check', 16, 'currentColor')} Marquer comme lu
          </button>
        </div>
      </div>
    `;
  },

  _renderQuiz(el, lesson) {
    this.quizAnswers = {};
    this.quizSubmitted = false;
    const questions = [
      { q: 'Qu\'est-ce qu\'une paire de devises ?', options: ['Deux devises échangées l\'une contre l\'autre','Une action cotée en bourse','Un indice financier','Un contrat à terme'], correct: 0 },
      { q: 'Que signifie "pip" en trading Forex ?', options: ['Percentage in Point — la plus petite variation de prix','Le profit d\'une position','Un indicateur d\'amplitude','Le spread entre bid et ask'], correct: 0 },
      { q: 'Quelle est la session de trading la plus liquide ?', options: ['Session de Tokyo','Session de Londres','Session de New York','Chevauchement Londres-New York'], correct: 3 },
    ];

    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Screens.formations.openModule('${this.currentModule.id}')">
          ${ET.svgIcon('arrowLeft', 20)} Quiz
        </div>
        <span style="font-size:13px;font-weight:600;color:var(--text-muted)">${questions.length} questions</span>
      </div>
      <div class="screen-content">
        <div style="padding:var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-4)">
          ${questions.map((q, qi) => `
            <div class="quiz-card">
              <div class="quiz-question">Q${qi+1}. ${q.q}</div>
              ${q.options.map((opt, oi) => `
                <div class="quiz-option" id="q${qi}-o${oi}" onclick="ET.Screens.formations._selectQuizOption(${qi},${oi},${q.correct})">
                  <div class="quiz-letter">${'ABCD'[oi]}</div>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
          <button class="btn btn-primary btn-block btn-lg" id="quiz-submit-btn" onclick="ET.Screens.formations._submitQuiz(${questions.length})" disabled>
            Soumettre le quiz
          </button>
        </div>
      </div>
    `;
  },

  _selectQuizOption(qi, oi, correct) {
    if (this.quizSubmitted) return;
    this.quizAnswers[qi] = oi;
    document.querySelectorAll(`[id^="q${qi}-o"]`).forEach((el, i) => {
      el.classList.toggle('selected', i === oi);
    });
    // Check if all answered
    const submitBtn = document.getElementById('quiz-submit-btn');
    if (submitBtn) submitBtn.disabled = false;
  },

  _submitQuiz(total) {
    this.quizSubmitted = true;
    const correct = Object.keys(this.quizAnswers).filter(qi => this.quizAnswers[qi] === 0).length;
    const score = Math.round(correct / total * 100);
    const btn = document.getElementById('quiz-submit-btn');
    btn.disabled = true;

    setTimeout(() => {
      ET.toast.show(score >= 70 ? `Quiz réussi ! ${score}% de bonnes réponses ✅` : `${score}% — Révisez et réessayez`, score >= 70 ? 'success' : 'error', 4000);
      if (score >= 70) {
        ET.Screens.formations._completeLesson(this.currentLesson.id, true);
      }
    }, 500);
  },

  _completeLesson(lessonId, fromQuiz = false) {
    ET.Auth.updateProgress(lessonId, true);
    ET.toast.show('Leçon terminée ! ✅', 'success');
    setTimeout(() => {
      ET.Screens.formations.openModule(this.currentModule.id);
    }, fromQuiz ? 500 : 800);
  }
};
