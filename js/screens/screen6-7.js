// ═══════════════════════════════════════════════
// SCREENS: Community (6) + Analyses (7)
// ═══════════════════════════════════════════════

// ─── SCREEN 6: COMMUNITY ─────────────────────
ET.Screens.community = {
  activeTab: 'forum',

  render() {
    const u = ET.Auth.currentUser;
    const isPremium = u?.plan === 'premium' || u?.plan === 'elite';
    const el = document.getElementById('screen-community');
    el.innerHTML = `
      <div class="app-header">
        <div style="display:flex;align-items:center;gap:var(--sp-3)">
          ${ET.svgIcon('users', 22, 'var(--blue-dark)')}
          <div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:16px">Communauté</div>
            <div style="font-size:11px;color:var(--text-muted)">247 membres actifs</div>
          </div>
        </div>
        <button class="header-btn" onclick="ET.Screens.community._openNewPost()">
          ${ET.svgIcon('plus', 18, 'var(--blue-dark)')}
        </button>
      </div>
      <div class="screen-content">
        <!-- Telegram Section -->
        <div style="margin:var(--sp-4);background:linear-gradient(135deg,#0088CC,#006AA3);border-radius:var(--radius-lg);padding:var(--sp-4);display:flex;align-items:center;gap:var(--sp-3)">
          <div style="width:48px;height:48px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${ET.svgIcon('telegram', 28, '#fff')}
          </div>
          <div style="flex:1">
            <div style="font-weight:700;color:#fff;font-size:15px">Groupe Telegram gratuit</div>
            <div style="font-size:12px;color:rgba(255,255,255,.75)">+1 200 membres · Analyses quotidiennes</div>
          </div>
          <a href="https://t.me/emmanueltrading" target="_blank" class="btn btn-sm" style="background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.3);white-space:nowrap;text-decoration:none">
            Rejoindre
          </a>
        </div>

        ${!isPremium ? `
        <!-- Premium Lock -->
        <div style="margin:0 var(--sp-4) var(--sp-4);background:linear-gradient(135deg,var(--blue-dark),var(--blue-mid));border-radius:var(--radius-lg);padding:var(--sp-5);text-align:center;position:relative;overflow:hidden">
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 30%,rgba(212,160,23,.15),transparent 60%)"></div>
          <div style="position:relative">
            <div style="font-size:36px;margin-bottom:var(--sp-2)">🔒</div>
            <h3 style="color:#fff;font-weight:800;margin-bottom:var(--sp-2)">Communauté Premium</h3>
            <p style="color:rgba(255,255,255,.7);font-size:13px;line-height:1.6;margin-bottom:var(--sp-4)">Analyses exclusives, signaux commentés, replays live et forum privé réservés aux membres Premium</p>
            <button class="btn btn-primary" onclick="ET.Router.go('payments');ET.Screens.payments.render()">
              Passer en Premium — 7 500 FCFA/mois
            </button>
          </div>
        </div>
        ` : ''}

        <!-- Tabs -->
        <div style="padding:0 var(--sp-4) var(--sp-3)">
          <div class="tabs">
            <div class="tab-btn ${this.activeTab==='forum'?'active':''}" onclick="ET.Screens.community.setTab('forum')">Forum</div>
            <div class="tab-btn ${this.activeTab==='analyses'?'active':''}" onclick="ET.Screens.community.setTab('analyses')">Exclusifs${!isPremium?'🔒':''}</div>
            <div class="tab-btn ${this.activeTab==='replays'?'active':''}" onclick="ET.Screens.community.setTab('replays')">Replays${!isPremium?'🔒':''}</div>
          </div>
        </div>

        <!-- Tab Content -->
        <div id="community-content">
          ${this._renderTab(this.activeTab, isPremium)}
        </div>
      </div>
    `;
  },

  setTab(tab) {
    const u = ET.Auth.currentUser;
    const isPremium = u?.plan === 'premium' || u?.plan === 'elite';
    if ((tab === 'analyses' || tab === 'replays') && !isPremium) {
      ET.toast.show('Contenu réservé aux membres Premium', 'warning');
      ET.Router.go('payments');
      ET.Screens.payments.render();
      return;
    }
    this.activeTab = tab;
    document.querySelectorAll('.tabs .tab-btn').forEach((b, i) => {
      b.classList.toggle('active', i === ['forum','analyses','replays'].indexOf(tab));
    });
    document.getElementById('community-content').innerHTML = this._renderTab(tab, isPremium);
  },

  _renderTab(tab, isPremium) {
    if (tab === 'forum') return this._renderForum();
    if (tab === 'analyses' && isPremium) return this._renderPremiumAnalyses();
    if (tab === 'replays' && isPremium) return this._renderReplays();
    return '<div class="empty-state"><div class="empty-state-icon">🔒</div><div class="empty-state-title">Contenu Premium</div></div>';
  },

  _renderForum() {
    return `<div style="padding:0 var(--sp-4)">
      ${ET.DATA.forumPosts.map(p => `
        <div class="forum-post mb-3 ${p.pinned?'forum-pin':''}" onclick="ET.Screens.community._openPost('${p.id}')">
          <div class="forum-post-header">
            <div class="avatar avatar-sm">${p.authorInitials}</div>
            <div class="forum-post-meta">
              <div class="forum-post-author">${p.author}</div>
              <div class="forum-post-time">
                <span class="level-badge ${p.authorLevel==='Débutant'?'level-debutant':p.authorLevel==='Confirmé'?'level-certifie':'level-intermediaire'}">${p.authorLevel}</span>
                · ${p.time}
              </div>
            </div>
            ${p.pinned ? `<span>${ET.svgIcon('pin',14,'var(--gold)')}</span>` : ''}
          </div>
          <div class="forum-post-title">${p.title}</div>
          <div class="forum-post-preview">${p.preview}</div>
          <div class="forum-post-footer">
            <div class="forum-action">${ET.svgIcon('heart',12)} ${p.likes}</div>
            <div class="forum-action">${ET.svgIcon('message',12)} ${p.replies}</div>
            <span class="badge badge-muted">${p.category}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  },

  _renderPremiumAnalyses() {
    return `<div style="padding:0 var(--sp-4)">
      ${ET.DATA.analyses.filter(a=>a.access==='premium').map(a => {
        const biasMap = { bullish: { cls: 'bias-bullish', txt: '↑ HAUSSIER' }, bearish: { cls: 'bias-bearish', txt: '↓ BAISSIER' }, neutral: { cls: 'bias-neutral', txt: '→ NEUTRE' } };
        const bias = biasMap[a.bias] || biasMap.neutral;
        return `
        <div class="analysis-card mb-3" onclick="ET.Screens.analyses.openDetail('${a.id}');ET.Router.go('analyses')">
          <div class="analysis-card-header">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div class="analysis-pair">${a.pair}</div>
              <span class="badge badge-premium">PREMIUM</span>
            </div>
            <div class="analysis-date">${ET.formatDateShort(a.date)}</div>
          </div>
          <div class="analysis-card-body">
            <div style="font-weight:700;font-size:15px;margin-bottom:8px">${a.title}</div>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:var(--sp-3);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.summary}</p>
            <span class="bias-tag ${bias.cls}">${bias.txt}</span>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  _renderReplays() {
    const replays = [
      { title: 'Session live — Analyse EUR/USD & Gold', date: '3 avril 2026', duration: '1h 24min', views: 89 },
      { title: 'Webinaire — Gestion du risque pratique', date: '28 mars 2026', duration: '58min', views: 134 },
      { title: 'Q&A — Vos questions sur la Psychologie', date: '21 mars 2026', duration: '45min', views: 201 },
    ];
    return `<div style="padding:0 var(--sp-4)">
      ${replays.map(r => `
        <div class="card mb-3" onclick="ET.toast.show('Lecture du replay…','info')">
          <div class="card-body" style="display:flex;gap:var(--sp-3);align-items:center">
            <div style="width:56px;height:56px;background:linear-gradient(135deg,var(--blue-dark),var(--blue-mid));border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${ET.svgIcon('play', 22, '#D4A017')}
            </div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:14px;margin-bottom:3px">${r.title}</div>
              <div style="font-size:12px;color:var(--text-muted)">${r.date} · ${r.duration} · 👁 ${r.views}</div>
            </div>
            ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
          </div>
        </div>
      `).join('')}
    </div>`;
  },

  _openPost(postId) {
    const post = ET.DATA.forumPosts.find(p => p.id === postId);
    if (!post) return;
    ET.toast.show(`"${post.title.substring(0,40)}…" — Fonctionnalité complète en production`, 'info', 3500);
  },

  _openNewPost() {
    const u = ET.Auth.currentUser;
    if (!u) { ET.toast.show('Connectez-vous pour poster','warning'); return; }
    ET.toast.show('Création de posts — disponible en production', 'info');
  }
};


// ─── SCREEN 7: ANALYSES ───────────────────────
ET.Screens.analyses = {
  activePair: 'all',
  activeType: 'all',
  currentAnalysis: null,

  render() {
    const el = document.getElementById('screen-analyses');
    el.innerHTML = `
      <div class="app-header">
        ${ET.svgIcon('chart', 22, 'var(--blue-dark)')}
        <div style="flex:1;margin-left:var(--sp-2)">
          <div style="font-family:var(--font-display);font-weight:800;font-size:16px">Analyses de marché</div>
          <div style="font-size:11px;color:var(--text-muted)">${ET.DATA.analyses.length} analyses disponibles</div>
        </div>
        <button class="header-btn" onclick="ET.Screens.analyses.render('calendar')">
          ${ET.svgIcon('calendar', 18)}
        </button>
      </div>
      <div class="screen-content">
        <!-- Filters -->
        <div style="padding:var(--sp-3) var(--sp-4) 0">
          <div class="chips mb-2">
            ${[['all','Toutes les paires'],['EUR/USD','EUR/USD'],['GBP/USD','GBP/USD'],['XAU/USD','XAU/USD']].map(([v,l]) => `
              <div class="chip ${this.activePair===v?'active':''}" onclick="ET.Screens.analyses.filterPair('${v}')">${l}</div>
            `).join('')}
          </div>
          <div class="chips">
            ${[['all','Tous types'],['technique','Technique'],['fondamentale','Fondamentale'],['hebdomadaire','Hebdo']].map(([v,l]) => `
              <div class="chip ${this.activeType===v?'active':''}" onclick="ET.Screens.analyses.filterType('${v}')">${l}</div>
            `).join('')}
          </div>
        </div>

        <!-- Calendrier Économique (Tab) -->
        <div style="margin:var(--sp-3) var(--sp-4) 0">
          <div class="tabs">
            <div class="tab-btn active" onclick="">> Analyses</div>
            <div class="tab-btn" onclick="ET.Screens.analyses.renderCalendar()">📅 Calendrier</div>
          </div>
        </div>

        <!-- Analysis List -->
        <div style="padding:var(--sp-3) var(--sp-4)" id="analyses-list">
          ${this._renderList()}
        </div>
      </div>
    `;
  },

  renderCalendar() {
    const el = document.getElementById('screen-analyses');
    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Screens.analyses.render()">
          ${ET.svgIcon('arrowLeft', 20)} Analyses
        </div>
        <span style="font-weight:800;font-family:var(--font-display)">Calendrier économique</span>
        <div style="width:38px"></div>
      </div>
      <div class="screen-content">
        <div style="padding:var(--sp-3) var(--sp-4) 0">
          <div class="chips">
            ${['Toutes','USD','EUR','GBP'].map(c => `
              <div class="chip ${c==='Toutes'?'active':''}">${c}</div>
            `).join('')}
          </div>
        </div>
        <div style="padding:var(--sp-4)">
          <div class="section-title mb-3">Cette semaine</div>
          <div class="card">
            ${ET.DATA.econCalendar.map(e => `
              <div class="econ-calendar-item">
                <div class="econ-impact impact-${e.impact}"></div>
                <div class="econ-info">
                  <div class="econ-name">${e.name}</div>
                  <div class="econ-pair">${e.pair} · ${ET.formatDateShort(e.date)}</div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:2px">Prévu: ${e.forecast || '–'} · Précédent: ${e.previous}</div>
                </div>
                <div class="econ-time">${e.time}</div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:var(--sp-4);display:flex;gap:var(--sp-4);font-size:12px;color:var(--text-muted)">
            <div style="display:flex;align-items:center;gap:6px"><div class="econ-impact impact-high" style="width:10px;height:10px;border-radius:50%"></div>Impact élevé</div>
            <div style="display:flex;align-items:center;gap:6px"><div class="econ-impact impact-medium" style="width:10px;height:10px;border-radius:50%"></div>Moyen</div>
            <div style="display:flex;align-items:center;gap:6px"><div class="econ-impact impact-low" style="width:10px;height:10px;border-radius:50%"></div>Faible</div>
          </div>
        </div>
      </div>
    `;
  },

  filterPair(pair) {
    this.activePair = pair;
    document.getElementById('analyses-list').innerHTML = this._renderList();
  },

  filterType(type) {
    this.activeType = type;
    document.getElementById('analyses-list').innerHTML = this._renderList();
  },

  _renderList() {
    const u = ET.Auth.currentUser;
    const isPremium = u?.plan === 'premium' || u?.plan === 'elite';
    let list = ET.DATA.analyses;
    if (this.activePair !== 'all') list = list.filter(a => a.pair === this.activePair);
    if (this.activeType !== 'all') list = list.filter(a => a.type === this.activeType);

    if (!list.length) return '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">Aucune analyse trouvée</div></div>';

    const biasMap = { bullish: { cls: 'bias-bullish', txt: '↑ HAUSSIER' }, bearish: { cls: 'bias-bearish', txt: '↓ BAISSIER' }, neutral: { cls: 'bias-neutral', txt: '→ NEUTRE' } };

    return list.map(a => {
      const bias = biasMap[a.bias] || biasMap.neutral;
      const locked = a.access === 'premium' && !isPremium;
      return `
        <div class="analysis-card mb-3" onclick="${locked ? "ET.toast.show('Analyse reservée aux membres Premium','warning');ET.Router.go('payments');ET.Screens.payments.render()" : `ET.Screens.analyses.openDetail('${a.id}')`}">
          <div class="analysis-card-header">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div class="analysis-pair">${a.pair}</div>
              <div style="display:flex;gap:6px;align-items:center">
                <span class="badge badge-muted" style="font-size:10px">${a.timeframe}</span>
                <span class="badge ${a.access==='free'?'badge-gratuit':'badge-premium'}">${a.access==='free'?'GRATUIT':'PREMIUM'}</span>
              </div>
            </div>
            <div class="analysis-date">${ET.formatDateShort(a.date)}</div>
          </div>
          <div class="analysis-card-body">
            <div style="font-weight:700;font-size:15px;margin-bottom:8px;line-height:1.4">${a.title}</div>
            ${locked
              ? `<div style="display:flex;align-items:center;gap:var(--sp-2);color:var(--text-muted);font-size:13px">${ET.svgIcon('lock',14,'var(--text-muted)')} Débloquer avec Premium</div>`
              : `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:var(--sp-3);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.summary}</p>
                 <div style="display:flex;align-items:center;justify-content:space-between">
                   <span class="bias-tag ${bias.cls}">${bias.txt}</span>
                   <span style="font-size:13px;color:var(--gold);font-weight:600">Lire ${ET.svgIcon('arrowRight',13,'var(--gold)')}</span>
                 </div>`
            }
          </div>
        </div>`;
    }).join('');
  },

  openDetail(analysisId) {
    const a = ET.DATA.analyses.find(x => x.id === analysisId);
    if (!a) return;
    this.currentAnalysis = a;
    const u = ET.Auth.currentUser;
    const isPremium = u?.plan === 'premium' || u?.plan === 'elite';
    const locked = a.access === 'premium' && !isPremium;
    if (locked) { ET.toast.show('Contenu réservé aux membres Premium','warning'); ET.Router.go('payments'); ET.Screens.payments.render(); return; }

    const biasMap = { bullish: { cls: 'bias-bullish', txt: '↑ HAUSSIER', color: 'var(--green)' }, bearish: { cls: 'bias-bearish', txt: '↓ BAISSIER', color: 'var(--red)' }, neutral: { cls: 'bias-neutral', txt: '→ NEUTRE', color: '#7C3AED' } };
    const bias = biasMap[a.bias] || biasMap.neutral;

    const el = document.getElementById('screen-analyses');
    el.innerHTML = `
      <div class="back-btn" style="position:absolute;top:16px;left:var(--sp-4);z-index:10;color:rgba(255,255,255,.85)" onclick="ET.Screens.analyses.render()">
        ${ET.svgIcon('arrowLeft', 20, 'rgba(255,255,255,.85)')} Retour
      </div>
      <div class="screen-content no-nav">
        <div class="analysis-detail-header" style="padding-top:52px">
          <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-3)">
            <div class="analysis-pair">${a.pair}</div>
            <span class="badge badge-muted" style="background:rgba(255,255,255,.15);color:#fff;border:none">${a.timeframe}</span>
            <span class="badge ${a.access==='free'?'badge-gratuit':'badge-premium'}">${a.access==='free'?'GRATUIT':'PREMIUM'}</span>
          </div>
          <h1 style="font-size:18px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:var(--sp-2)">${a.title}</h1>
          <div style="display:flex;align-items:center;gap:var(--sp-3)">
            <span style="font-size:12px;color:rgba(255,255,255,.6)">${ET.formatDateShort(a.date)}</span>
            <div style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.3)"></div>
            <span class="bias-tag ${bias.cls}">${bias.txt}</span>
          </div>
        </div>

        <div style="padding:var(--sp-4) var(--sp-4) 40px">
          <!-- Chart Placeholder -->
          <div style="background:linear-gradient(145deg,#0a1628,#0d2137);border-radius:var(--radius-md);height:200px;display:flex;align-items:center;justify-content:center;margin-bottom:var(--sp-4);border:1px solid rgba(212,160,23,.15);position:relative;overflow:hidden">
            ${this._renderMiniChart()}
            <div style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);border-radius:var(--radius-sm);padding:6px 10px;font-size:11px;color:rgba(255,255,255,.6)">Graphique ${a.timeframe}</div>
          </div>

          <!-- Key Levels -->
          <div class="section-title mb-3">Niveaux clés</div>
          <div class="analysis-levels mb-4">
            ${[
              { label: 'Support', value: a.support, color: 'var(--green)' },
              { label: 'Résistance', value: a.resistance, color: 'var(--red)' },
              { label: 'Entrée potentielle', value: a.entry, color: 'var(--gold)' },
              { label: 'Stop Loss', value: a.stop, color: 'var(--red)' },
              { label: 'Objectif', value: a.target, color: 'var(--green)' },
              { label: 'Biais', value: bias.txt, color: bias.color },
            ].map(l => `
              <div class="level-item">
                <div class="level-item-label">${l.label}</div>
                <div class="level-item-value" style="color:${l.color}">${l.value}</div>
              </div>
            `).join('')}
          </div>

          <!-- Full Analysis -->
          <div class="section-title mb-3">Analyse complète</div>
          <div class="card mb-4">
            <div class="card-body">
              <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;white-space:pre-line">${a.fullText}</div>
            </div>
          </div>

          <!-- Share -->
          <div style="display:flex;gap:var(--sp-3)">
            <button class="btn btn-secondary flex-1" onclick="ET.toast.show('Partage WhatsApp intégré en production','info')">
              ${ET.svgIcon('whatsapp', 16, 'var(--green)')} WhatsApp
            </button>
            <button class="btn btn-secondary flex-1" onclick="ET.toast.show('Partage Telegram intégré en production','info')">
              ${ET.svgIcon('telegram', 16, '#0088CC')} Telegram
            </button>
          </div>
        </div>
      </div>
    `;
    ET.Router.go('analysis-detail');
  },

  _renderMiniChart() {
    const pts = [140,120,150,110,160,100,180,90,200,85,210,80];
    let path = '';
    pts.forEach((y, i) => {
      const x = 20 + i * 16;
      path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
    });
    const colors = ['#1A7A4A','#1A7A4A','#C0392B','#1A7A4A','#1A7A4A'];
    const candles = pts.slice(0, -1).map((p, i) => {
      const x = 20 + i * 16;
      const h = 10 + Math.abs(pts[i+1] - p);
      const isUp = pts[i+1] < p;
      return `<rect x="${x-3}" y="${Math.min(p,pts[i+1])}" width="6" height="${Math.max(h, 6)}" fill="${isUp?'#1A7A4A':'#C0392B'}" rx="1" opacity=".9"/>`;
    }).join('');
    return `<svg viewBox="0 0 220 220" width="100%" height="100%" preserveAspectRatio="none">
      <path d="${path}" fill="none" stroke="rgba(212,160,23,.5)" stroke-width="1.5"/>
      ${candles}
      <line x1="20" y1="80" x2="200" y2="80" stroke="rgba(212,160,23,.3)" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="205" y="84" font-size="10" fill="rgba(212,160,23,.8)">R</text>
      <line x1="20" y1="150" x2="200" y2="150" stroke="rgba(26,122,74,.4)" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="205" y="154" font-size="10" fill="rgba(26,122,74,.8)">S</text>
    </svg>`;
  }
};
