// ═══════════════════════════════════════════════
// SCREENS: Profile (10) + Notifications (11) + About (12)
// ═══════════════════════════════════════════════

// ─── SCREEN 10: PROFILE & SETTINGS ───────────
ET.Screens.profile = {
  activeView: 'profile', // profile | settings

  render(view = 'profile') {
    this.activeView = view;
    const u = ET.Auth.currentUser;
    if (!u) { ET.Router.go('auth'); ET.Screens.auth.render(); return; }

    const el = document.getElementById('screen-profile');
    el.innerHTML = `
      <div class="screen-content">
        <!-- Profile Hero -->
        <div class="profile-hero">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar">${ET.Auth.getInitials()}</div>
            <div class="profile-avatar-edit" onclick="ET.toast.show('Upload photo — disponible en production','info')">
              ${ET.svgIcon('edit', 12, 'var(--blue-dark)')}
            </div>
          </div>
          <div class="profile-name">${ET.Auth.getFullName()}</div>
          <div class="profile-email">${u.email}</div>
          <div style="display:flex;gap:var(--sp-2);margin-top:var(--sp-3)">
            <span class="level-badge ${u.tradingLevel==='Débutant'?'level-debutant':u.tradingLevel==='Intermédiaire'?'level-intermediaire':'level-avance'}">${u.tradingLevel}</span>
            ${u.plan !== 'essentiel' ? `<span class="badge badge-premium">${u.plan.toUpperCase()}</span>` : ''}
          </div>
        </div>

        <!-- Stats -->
        <div style="padding:var(--sp-4)">
          <div class="stats-row mb-4">
            <div class="stat-item">
              <div class="stat-value">${u.stats?.modulesCompleted || 0}</div>
              <div class="stat-label">Modules</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${u.stats?.quizPassed || 0}</div>
              <div class="stat-label">Quiz réussis</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${u.stats?.daysActive || 1}</div>
              <div class="stat-label">Jours actifs</div>
            </div>
          </div>

          <!-- Profile Edit -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Informations personnelles</div>
            <div class="settings-item" onclick="ET.Screens.profile._editInfo()">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('user', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Nom complet</div>
                <div class="settings-item-value">${ET.Auth.getFullName()}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('mail', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Email</div>
                <div class="settings-item-value">${u.email}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('phone', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Téléphone</div>
                <div class="settings-item-value">${u.phone || 'Non renseigné'}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('globe', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Pays / Ville</div>
                <div class="settings-item-value">${u.country}${u.city ? ` · ${u.city}` : ''}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
          </div>

          <!-- Abonnement -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Mon abonnement</div>
            <div class="settings-item" onclick="ET.Router.go('payments');ET.Screens.payments.render()">
              <div class="icon-wrap-sm icon-gold">${ET.svgIcon('creditCard', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Plan actuel</div>
                <div class="settings-item-value" style="color:var(--green)">${ET.Screens.payments._planName(u.plan)}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
          </div>

          <!-- Certificats -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Mes récompenses</div>
            <div class="settings-item" onclick="ET.generateCertificate('${ET.Auth.getFullName()}', 'Forex de A à Z')">
              <div class="icon-wrap-sm icon-gold">${ET.svgIcon('award', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Certificat — Forex de A à Z</div>
                <div class="settings-item-value">Obtenu le ${new Date().toLocaleDateString('fr-FR')}</div>
              </div>
              ${ET.svgIcon('download', 16, 'var(--gold)')}
            </div>
          </div>

          <!-- Paramètres -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Paramètres</div>
            <div class="settings-item">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('bell', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Notifications</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.Screens.profile._toggleTheme()">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('sunMoon', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Thème</div>
                <div class="settings-item-value" id="theme-value">${document.documentElement.dataset.theme === 'dark' ? 'Sombre' : 'Clair'}</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.toast.show('Changement de langue — bientôt','info')">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('globe', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Langue</div>
                <div class="settings-item-value">Français</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.toast.show('Changement de mot de passe — email envoyé','success')">
              <div class="icon-wrap-sm icon-red">${ET.svgIcon('lock', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label">Changer le mot de passe</div>
              </div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
          </div>

          <!-- Legal -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Légal & Confidentialité</div>
            <div class="settings-item" onclick="ET.Router.go('about');ET.Screens.about.render('about')">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('info', 15)}</div>
              <div class="settings-item-info"><div class="settings-item-label">À propos d'Emmanuel Trading</div></div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.toast.show('Politique de confidentialité — ouverture','info')">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('shield', 15)}</div>
              <div class="settings-item-info"><div class="settings-item-label">Politique de confidentialité</div></div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.toast.show('CGU — ouverture…','info')">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('fileText', 15)}</div>
              <div class="settings-item-info"><div class="settings-item-label">Conditions Générales d'Utilisation</div></div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
            <div class="settings-item" onclick="ET.toast.show('Export de données — email envoyé','success')">
              <div class="icon-wrap-sm icon-blue">${ET.svgIcon('download', 15)}</div>
              <div class="settings-item-info"><div class="settings-item-label">Exporter mes données personnelles</div></div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
          </div>

          <!-- Contact -->
          <div class="settings-section mb-4">
            <div class="settings-section-title">Support</div>
            <div class="settings-item" onclick="ET.Router.go('about');ET.Screens.about.render('support')">
              <div class="icon-wrap-sm icon-gold">${ET.svgIcon('helpCircle', 15)}</div>
              <div class="settings-item-info"><div class="settings-item-label">Contact & Support</div></div>
              ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
            </div>
          </div>

          <!-- Logout / Delete -->
          <div class="settings-section">
            <div class="settings-item" onclick="ET.Screens.profile._logout()">
              <div class="icon-wrap-sm icon-red">${ET.svgIcon('logout', 15)}</div>
              <div class="settings-item-info">
                <div class="settings-item-label" style="color:var(--red)">Se déconnecter</div>
              </div>
            </div>
            <div class="settings-item" onclick="ET.Screens.profile._deleteAccount()">
              <div class="icon-wrap-sm" style="background:rgba(192,57,43,.08)">${ET.svgIcon('trash', 15, 'var(--red)')}</div>
              <div class="settings-item-info">
                <div class="settings-item-label" style="color:var(--red)">Supprimer le compte</div>
              </div>
            </div>
          </div>

          <div style="text-align:center;margin-top:var(--sp-6);margin-bottom:var(--sp-4)">
            <div style="font-size:12px;color:var(--text-muted)">${ET.DATA.brand.name} v1.0.0</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-style:italic">© ${new Date().getFullYear()} · ${ET.DATA.brand.tagline}</div>
          </div>
        </div>
      </div>
    `;
  },

  _editInfo() {
    ET.toast.show('Édition du profil — disponible en production', 'info');
  },

  _toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('et_theme', next);
    const lbl = document.getElementById('theme-value');
    if (lbl) lbl.textContent = next === 'dark' ? 'Sombre' : 'Clair';
    ET.toast.show(`Thème ${next === 'dark' ? 'sombre' : 'clair'} activé`, 'success');
  },

  _logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      ET.Auth.logout();
      ET.Router.go('auth');
      ET.Screens.auth.render('login');
      ET.toast.show('Déconnexion réussie', 'success');
    }
  },

  _deleteAccount() {
    if (confirm('ATTENTION : Cette action est irréversible. Supprimer votre compte ?')) {
      ET.Auth.logout();
      localStorage.clear();
      ET.Router.go('auth');
      ET.Screens.auth.render('login');
      ET.toast.show('Compte supprimé. À bientôt.', 'info');
    }
  }
};


// ─── SCREEN 11: NOTIFICATIONS ────────────────
ET.Screens.notifications = {
  render() {
    const unread = ET.DATA.notifications.filter(n => !n.read).length;
    const el = document.getElementById('screen-notifications');
    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Router.back()">
          ${ET.svgIcon('arrowLeft', 20)} Retour
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-family:var(--font-display);font-weight:800;font-size:16px">Notifications</div>
          ${unread > 0 ? `<div style="font-size:11px;color:var(--red)">${unread} non lue${unread>1?'s':''}</div>` : ''}
        </div>
        <button class="header-btn" onclick="ET.Screens.notifications._markAllRead()">
          ${ET.svgIcon('check', 16)}
        </button>
      </div>
      <div class="screen-content" style="padding-bottom:var(--sp-4)">
        ${ET.DATA.notifications.length === 0
          ? `<div class="empty-state"><div class="empty-state-icon">🔔</div><div class="empty-state-title">Aucune notification</div></div>`
          : `<div class="card" style="margin:var(--sp-4)">
              ${ET.DATA.notifications.map(n => `
                <div class="notif-item ${n.read?'read':'unread'}" onclick="ET.Screens.notifications._markRead('${n.id}')">
                  <div class="notif-dot"></div>
                  <div class="notif-icon-wrap" style="background:${n.iconBg}">
                    <span style="font-size:18px">${n.icon}</span>
                  </div>
                  <div class="notif-content">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-body">${n.body}</div>
                    <div class="notif-time">${n.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </div>
    `;
    ET.Router.go('notifications');
  },

  _markRead(notifId) {
    const n = ET.DATA.notifications.find(n => n.id === notifId);
    if (n) n.read = true;
    this.render();
  },

  _markAllRead() {
    ET.DATA.notifications.forEach(n => n.read = true);
    this.render();
    ET.toast.show('Toutes les notifications marquées comme lues', 'success');
    // Update header badge
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.remove();
  }
};


// ─── SCREEN 12: ABOUT & SUPPORT ──────────────
ET.Screens.about = {
  activeView: 'about',

  render(view = 'about') {
    this.activeView = view;
    const el = document.getElementById('screen-about');
    el.innerHTML = `
      <div class="app-header">
        <div class="back-btn" onclick="ET.Router.back()">
          ${ET.svgIcon('arrowLeft', 20)} Retour
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-family:var(--font-display);font-weight:800;font-size:16px">${view === 'about' ? 'À propos' : 'Contact & Support'}</div>
        </div>
        <div style="width:38px"></div>
      </div>
      <div class="screen-content no-nav">
        <div style="padding:0 var(--sp-4) 60px">
          <!-- Tabs -->
          <div class="tabs mt-3 mb-4">
            <div class="tab-btn ${view==='about'?'active':''}" onclick="ET.Screens.about.render('about')">À propos</div>
            <div class="tab-btn ${view==='support'?'active':''}" onclick="ET.Screens.about.render('support')">Support</div>
            <div class="tab-btn ${view==='faq'?'active':''}" onclick="ET.Screens.about.render('faq')">FAQ</div>
          </div>

          ${view === 'about' ? this._renderAbout() : view === 'support' ? this._renderSupport() : this._renderFaq()}
        </div>
      </div>
    `;
    ET.Router.go('about');
  },

  _renderAbout() {
    return `
      <!-- Hero -->
      <div class="about-hero" style="margin:-16px -16px 24px;border-radius:0;padding:var(--sp-8) var(--sp-5) var(--sp-6)">
        <div style="width:72px;height:72px;background:linear-gradient(135deg,var(--blue-mid),var(--blue-dark));border-radius:18px;display:flex;align-items:center;justify-content:center;margin:0 auto var(--sp-4);border:2px solid rgba(212,160,23,.3)">
          <span style="font-family:var(--font-display);font-size:38px;font-weight:900;color:#fff">E</span>
        </div>
        <div style="font-family:var(--font-display);font-size:24px;font-weight:800;color:#fff;text-align:center;margin-bottom:var(--sp-2)">${ET.DATA.brand.name}</div>
        <div class="about-tagline">${ET.DATA.brand.tagline}</div>
      </div>

      <!-- Story -->
      <div class="card mb-4">
        <div class="card-body">
          <h3 style="font-weight:800;margin-bottom:var(--sp-3)">Notre histoire</h3>
          <p style="font-size:14px;color:var(--text-secondary);line-height:1.8">
            Emmanuel Trading est née d'un constat simple : trop de jeunes Africains perdent leur épargne en cherchant à trader sans formation sérieuse. Face à la prolifération de promesses de gains faciles sur les réseaux sociaux, nous avons décidé de proposer une alternative sérieuse.
          </p>
          <p style="font-size:14px;color:var(--text-secondary);line-height:1.8;margin-top:var(--sp-3)">
            Fondée au Togo, notre mission est de démocratiser l'accès à une éducation financière de qualité en Afrique de l'Ouest, en français, adaptée aux réalités du continent.
          </p>
        </div>
      </div>

      <!-- Values -->
      <div class="section-title mb-3">Nos valeurs</div>
      <div class="card mb-4">
        <div class="card-body">
          ${[
            { icon: '🎓', title: 'Pédagogie avant tout', text: 'Nous n\'enseignons que ce qui fonctionne réellement, avec des exemples concrets du marché Forex.' },
            { icon: '🛡️', title: 'Honnêteté absolue', text: 'Pas de promesses de gains garantis. Le trading comporte des risques — nous les exposons clairement.' },
            { icon: '🌍', title: 'Pensé pour l\'Afrique', text: 'Modes de paiement locaux, connexion 3G optimisée, contenu contextualisé à la réalité africaine.' },
            { icon: '🤝', title: 'Communauté soudée', text: 'Une communauté de pairs qui progressent ensemble, s\'entraident et célèbrent les succès collectifs.' },
          ].map(v => `
            <div class="value-item">
              <div class="value-icon" style="font-size:24px">${v.icon}</div>
              <div>
                <div class="value-title">${v.title}</div>
                <div class="value-text">${v.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="text-align:center;padding:var(--sp-4);background:rgba(212,160,23,.06);border-radius:var(--radius-md);border:1px solid rgba(212,160,23,.15)">
        <div style="font-size:13px;color:var(--text-muted)">📍 Lomé, Togo — Afrique de l'Ouest</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px">🌐 UEMOA — Togo · Bénin · CI · Sénégal</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:var(--sp-3);font-style:italic">${ET.DATA.brand.name} © 2025-2026</div>
      </div>
    `;
  },

  _renderSupport() {
    return `
      <div class="section-title mb-3">Nous contacter</div>
      <div class="mb-4">
        <a href="mailto:${ET.DATA.brand.email}" class="contact-link-item">
          <div class="icon-wrap icon-blue">${ET.svgIcon('mail', 22)}</div>
          <div>
            <div class="contact-link-label">Email</div>
            <div class="contact-link-sub">${ET.DATA.brand.email}</div>
          </div>
          ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
        </a>
        <a href="https://wa.me/${ET.DATA.brand.whatsapp}" target="_blank" class="contact-link-item">
          <div class="icon-wrap" style="background:rgba(37,211,102,.12);color:#25D366">${ET.svgIcon('whatsapp', 22, '#25D366')}</div>
          <div>
            <div class="contact-link-label">WhatsApp Business</div>
            <div class="contact-link-sub">${ET.DATA.brand.phone}</div>
          </div>
          ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
        </a>
        <a href="https://t.me/${ET.DATA.brand.telegram}" target="_blank" class="contact-link-item">
          <div class="icon-wrap" style="background:rgba(0,136,204,.12);color:#0088CC">${ET.svgIcon('telegram', 22, '#0088CC')}</div>
          <div>
            <div class="contact-link-label">Telegram</div>
            <div class="contact-link-sub">t.me/${ET.DATA.brand.telegram}</div>
          </div>
          ${ET.svgIcon('chevronRight', 16, 'var(--text-muted)')}
        </a>
      </div>

      <div class="section-title mb-3">Formulaire de contact</div>
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input type="text" class="form-control" placeholder="Votre nom" value="${ET.Auth.getFullName()}">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" placeholder="votre@email.com" value="${ET.Auth.currentUser?.email || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Sujet</label>
            <select class="form-control">
              <option>Problème technique</option>
              <option>Question sur une formation</option>
              <option>Problème de paiement</option>
              <option>Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-control" rows="4" placeholder="Décrivez votre question…" style="resize:none"></textarea>
          </div>
          <button class="btn btn-primary btn-block" onclick="ET.toast.show('Message envoyé ! Réponse sous 24-48h.','success')">
            ${ET.svgIcon('send', 16, 'currentColor')} Envoyer
          </button>
        </div>
      </div>
    `;
  },

  _renderFaq() {
    return `
      <div class="section-title mb-3">Questions fréquentes</div>
      <div class="card">
        <div class="card-body" id="faq-container">
          ${ET.DATA.faq.map((item, i) => `
            <div class="accordion-item" id="faq-${i}">
              <div class="accordion-header" onclick="ET.Screens.about.toggleFaq(${i})">
                <span>${item.q}</span>
                <span class="accordion-icon">${ET.svgIcon('chevronDown', 16)}</span>
              </div>
              <div class="accordion-body">
                <div class="accordion-body-inner">${item.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleFaq(index) {
    const item = document.getElementById(`faq-${index}`);
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item').forEach(el => {
      el.classList.remove('open');
      const body = el.querySelector('.accordion-body');
      if (body) body.style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      const body = item.querySelector('.accordion-body');
      const inner = item.querySelector('.accordion-body-inner');
      if (body && inner) body.style.maxHeight = inner.scrollHeight + 32 + 'px';
    }
  }
};


// ─── Theme Persistence ────────────────────────
(function() {
  const saved = localStorage.getItem('et_theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();
