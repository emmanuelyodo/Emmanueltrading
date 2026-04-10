// ═══════════════════════════════════════════════
// SCREENS: Splash, Onboarding, Auth
// ═══════════════════════════════════════════════

// ─── SCREEN 1: SPLASH ─────────────────────────
ET.Screens.splash = {
  show() {
    const el = document.getElementById('screen-splash');
    el.innerHTML = `
      <div class="splash-logo-wrap">
        <img src="assets/logo.png" alt="Emmanuel Trading Logo" class="splash-logo-img">
      </div>
      <div class="splash-tagline">« On ne promet pas la fortune. On construit des traders. »</div>
      <div class="splash-loader">
        <div class="splash-loader-bar">
          <div class="splash-loader-progress"></div>
        </div>
        <span style="font-size:11px;color:rgba(255,255,255,.4)">Chargement…</span>
      </div>
    `;
    el.classList.add('active');

    setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('et_onboarding_done');
      if (ET.Auth.isLoggedIn()) {
        ET.Router.go('dashboard');
        ET.Screens.dashboard.render();
      } else if (hasSeenOnboarding) {
        ET.Router.go('auth');
        ET.Screens.auth.render();
      } else {
        ET.Router.go('onboarding');
        ET.Screens.onboarding.render();
      }
    }, 2800);
  }
};

// ─── SCREEN 2: ONBOARDING ─────────────────────
ET.Screens.onboarding = {
  currentSlide: 0,
  slides: [
    {
      icon: `<img src="assets/onboarding1.png" width="220" height="220" style="object-fit:contain">`,
      title: 'Bienvenue sur Emmanuel Trading',
      text: 'La plateforme d\'éducation Forex pensée pour l\'Afrique. Apprenez à trader sérieusement, à votre rythme.'
    },
    {
      icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="180" height="180">
        <rect width="200" height="200" rx="20" fill="rgba(255,255,255,.05)"/>
        ${[
          ['📈','Technique','#1A4A7A',30,30],
          ['📰','Fondamentale','#1A7A4A',110,30],
          ['⚖️','Risque','#D4A017',30,110],
          ['🎯','Stratégie','#7C3AED',110,110],
        ].map(([ic,lb,bg,x,y]) => `
          <rect x="${x}" y="${y}" width="68" height="68" rx="12" fill="${bg}" opacity=".85"/>
          <text x="${x+34}" y="${y+36}" text-anchor="middle" font-size="24">${ic}</text>
          <text x="${x+34}" y="${y+56}" text-anchor="middle" font-size="9" fill="white" font-family="Inter">${lb}</text>
        `).join('')}
      </svg>`,
      title: 'Une formation complète',
      text: 'Analyse technique, fondamentale, gestion du risque, stratégies — tout ce qu\'il faut pour trader avec méthode.'
    },
    {
      icon: `<img src="assets/onboarding3.png" width="220" height="220" style="object-fit:contain">`,
      title: 'Rejoignez la communauté',
      text: 'Analyses quotidiennes, signaux commentés, questions-réponses. Progressez entouré de traders sérieux.'
    }
  ],

  render() {
    this.currentSlide = 0;
    const el = document.getElementById('screen-onboarding');
    el.innerHTML = `
      <span class="onboarding-skip" onclick="ET.Screens.onboarding.complete()">Passer</span>
      <div class="onboarding-slides" id="ob-slides">
        ${this.slides.map((s, i) => `
          <div class="onboarding-slide">
            <div class="onboarding-illustration">${s.icon}</div>
            <h2 class="onboarding-title">${s.title}</h2>
            <p class="onboarding-text">${s.text}</p>
          </div>
        `).join('')}
      </div>
      <div class="onboarding-footer">
        <div class="onboarding-dots" id="ob-dots">
          ${this.slides.map((_, i) => `<div class="onboarding-dot ${i === 0 ? 'active' : ''}" id="ob-dot-${i}"></div>`).join('')}
        </div>
        <button class="btn btn-primary" id="ob-next-btn" onclick="ET.Screens.onboarding.next()">
          Suivant ${ET.svgIcon('arrowRight', 16, 'currentColor')}
        </button>
      </div>
    `;
  },

  next() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this._updateSlide();
    } else {
      this.complete();
    }
  },

  _updateSlide() {
    const slidesEl = document.getElementById('ob-slides');
    slidesEl.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    document.querySelectorAll('.onboarding-dot').forEach((d, i) => {
      d.classList.toggle('active', i === this.currentSlide);
    });
    const btn = document.getElementById('ob-next-btn');
    if (this.currentSlide === this.slides.length - 1) {
      btn.innerHTML = 'Commencer ' + ET.svgIcon('arrowRight', 16, 'currentColor');
      btn.style.background = 'var(--gold)';
    }
  },

  complete() {
    localStorage.setItem('et_onboarding_done', '1');
    ET.Router.go('auth');
    ET.Screens.auth.render();
  }
};

// ─── SCREEN 3: AUTH ───────────────────────────
ET.Screens.auth = {
  mode: 'login', // login | register | reset

  render(mode = 'login') {
    this.mode = mode;
    const el = document.getElementById('screen-auth');
    el.innerHTML = `
      <div class="auth-header">
        <div class="auth-logo">
          <div class="auth-logo-mark">
            <span style="font-family:var(--font-display);font-weight:900;font-size:22px;color:#fff">E</span>
          </div>
          <div class="auth-logo-name">Emmanuel <span>Trading</span></div>
        </div>
        <h2 class="auth-title" id="auth-title">Bon retour !</h2>
        <p class="auth-subtitle" id="auth-subtitle">Connectez-vous pour continuer votre formation</p>
      </div>
      <div class="auth-form-container">
        <div class="auth-tabs">
          <div class="auth-tab ${mode === 'login' ? 'active' : ''}" onclick="ET.Screens.auth.switchTab('login')">Connexion</div>
          <div class="auth-tab ${mode === 'register' ? 'active' : ''}" onclick="ET.Screens.auth.switchTab('register')">Inscription</div>
        </div>

        <!-- LOGIN FORM -->
        <div class="auth-form ${mode === 'login' ? 'active' : ''}" id="form-login">
          ${this._loginForm()}
        </div>

        <!-- REGISTER FORM -->
        <div class="auth-form ${mode === 'register' ? 'active' : ''}" id="form-register">
          ${this._registerForm()}
        </div>

        <!-- RESET FORM -->
        <div class="auth-form" id="form-reset">
          ${this._resetForm()}
        </div>
      </div>
    `;
  },

  _loginForm() {
    return `
      <div class="form-group">
        <label class="form-label">Adresse email</label>
        <input type="email" class="form-control" id="login-email" placeholder="votre@email.com" value="demo@emmanueltrading.tg">
      </div>
      <div class="form-group">
        <label class="form-label">Mot de passe</label>
        <div class="input-wrapper">
          <input type="password" class="form-control" id="login-pwd" placeholder="••••••••" value="demo1234">
          <span class="input-icon" onclick="ET.Screens.auth.togglePwd('login-pwd')" id="login-eye">${ET.svgIcon('eye', 18)}</span>
        </div>
      </div>
      <div style="text-align:right;margin-bottom:var(--sp-4)">
        <span style="font-size:13px;color:var(--gold);cursor:pointer;font-weight:600" onclick="ET.Screens.auth.showReset()">Mot de passe oublié ?</span>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="login-btn" onclick="ET.Screens.auth.doLogin()">
        <span>Se connecter</span>
      </button>
      <div class="divider">ou</div>
      <button class="google-btn" onclick="ET.toast.show('Connexion Google — bientôt disponible', 'info')">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continuer avec Google
      </button>
      <p style="text-align:center;margin-top:var(--sp-5);font-size:13px;color:var(--text-muted)">
        Pas encore de compte ?
        <span style="color:var(--gold);font-weight:600;cursor:pointer" onclick="ET.Screens.auth.switchTab('register')">S'inscrire</span>
      </p>
      <p style="text-align:center;margin-top:var(--sp-3);font-size:12px;color:var(--text-muted)">
        <em>Compte démo : demo@emmanueltrading.tg / demo1234</em>
      </p>
    `;
  },

  _registerForm() {
    const countries = ['Togo','Bénin','Côte d\'Ivoire','Sénégal','Cameroun','Mali','Burkina Faso','Niger','Ghana','Nigeria','France','Autre'];
    const phonePrefixes = ['+228 (Togo)','+229 (Bénin)','+225 (CI)','+221 (Sénégal)','+237 (Cameroun)','+33 (France)'];
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3)">
        <div class="form-group" style="margin:0">
          <label class="form-label">Prénom *</label>
          <input type="text" class="form-control" id="reg-firstname" placeholder="Kofi">
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Nom *</label>
          <input type="text" class="form-control" id="reg-lastname" placeholder="Mensah">
        </div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" id="reg-email" placeholder="votre@email.com">
      </div>
      <div class="form-group">
        <label class="form-label">Téléphone *</label>
        <div class="input-with-prefix">
          <select style="background:var(--bg-light);border:none;padding:0 8px;font-size:13px;font-weight:600;color:var(--text-secondary);outline:none;cursor:pointer;border-right:1.5px solid var(--border)" id="reg-prefix">
            ${phonePrefixes.map(p => `<option value="${p.split(' ')[0]}">${p}</option>`).join('')}
          </select>
          <input type="tel" class="form-control" id="reg-phone" placeholder="90 00 00 00">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3)">
        <div class="form-group" style="margin:0">
          <label class="form-label">Pays *</label>
          <select class="form-control" id="reg-country">
            ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Ville</label>
          <input type="text" class="form-control" id="reg-city" placeholder="Lomé">
        </div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label">Mot de passe * (min. 8 car.)</label>
        <div class="input-wrapper">
          <input type="password" class="form-control" id="reg-pwd" placeholder="••••••••" oninput="ET.Screens.auth.updateStrength()">
          <span class="input-icon" onclick="ET.Screens.auth.togglePwd('reg-pwd')">${ET.svgIcon('eye', 18)}</span>
        </div>
        <div class="password-strength" id="pwd-strength" style="display:none">
          <div class="strength-bar" id="sb1"></div>
          <div class="strength-bar" id="sb2"></div>
          <div class="strength-bar" id="sb3"></div>
          <div class="strength-bar" id="sb4"></div>
          <span class="strength-label" id="sl"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Confirmer le mot de passe *</label>
        <input type="password" class="form-control" id="reg-pwd2" placeholder="••••••••">
      </div>
      <div class="form-group">
        <label class="form-check">
          <input type="checkbox" id="reg-cgu">
          <span class="check-label">J'accepte les <span style="color:var(--gold)">CGU</span> et la <span style="color:var(--gold)">Politique de confidentialité</span></span>
        </label>
      </div>
      <div class="form-group">
        <label class="form-check">
          <input type="checkbox" id="reg-newsletter" checked>
          <span class="check-label">Recevoir les analyses de marché et actualités</span>
        </label>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="register-btn" onclick="ET.Screens.auth.doRegister()">
        Créer mon compte
      </button>
      <div class="divider">ou</div>
      <button class="google-btn" onclick="ET.toast.show('Connexion Google — bientôt disponible','info')">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continuer avec Google
      </button>
    `;
  },

  _resetForm() {
    return `
      <div style="text-align:center;margin-bottom:var(--sp-6)">
        <div style="width:60px;height:60px;background:rgba(212,160,23,.12);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto var(--sp-4)">${ET.svgIcon('lock', 28, 'var(--gold)')}</div>
        <h3 style="font-size:20px;font-weight:800;margin-bottom:8px">Mot de passe oublié</h3>
        <p style="font-size:14px;color:var(--text-muted)">Entrez votre email pour recevoir un lien de réinitialisation valable 24h</p>
      </div>
      <div class="form-group">
        <label class="form-label">Adresse email</label>
        <input type="email" class="form-control" id="reset-email" placeholder="votre@email.com">
      </div>
      <button class="btn btn-primary btn-block btn-lg" onclick="ET.Screens.auth.doReset()">
        Envoyer le lien ${ET.svgIcon('send', 16, 'currentColor')}
      </button>
      <p style="text-align:center;margin-top:var(--sp-4)">
        <span style="font-size:13px;color:var(--gold);cursor:pointer;font-weight:600" onclick="ET.Screens.auth.switchTab('login')">← Retour à la connexion</span>
      </p>
    `;
  },

  switchTab(tab) {
    this.mode = tab;
    const title = document.getElementById('auth-title');
    const sub = document.getElementById('auth-subtitle');
    if (tab === 'login') {
      title && (title.textContent = 'Bon retour !');
      sub && (sub.textContent = 'Connectez-vous pour continuer votre formation');
    } else {
      title && (title.textContent = 'Créer un compte');
      sub && (sub.textContent = 'Rejoignez la communauté Emmanuel Trading');
    }
    document.querySelectorAll('.auth-tab').forEach((t, i) => {
      t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
    });
    document.getElementById('form-login').classList.toggle('active', tab === 'login');
    document.getElementById('form-register').classList.toggle('active', tab === 'register');
    document.getElementById('form-reset').classList.toggle('active', tab === 'reset');
  },

  showReset() {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('form-login').classList.remove('active');
    document.getElementById('form-register').classList.remove('active');
    document.getElementById('form-reset').classList.add('active');
    const title = document.getElementById('auth-title');
    title && (title.textContent = 'Réinitialisation');
  },

  togglePwd(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  updateStrength() {
    const pwd = document.getElementById('reg-pwd').value;
    const wrap = document.getElementById('pwd-strength');
    if (!pwd) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';
    const s = ET.Auth.passwordStrength(pwd);
    const bars = [document.getElementById('sb1'),document.getElementById('sb2'),document.getElementById('sb3'),document.getElementById('sb4')];
    const counts = { weak: 1, medium: 2, strong: 4 };
    const count = counts[s.level];
    const cls = { weak: 'active-weak', medium: 'active-medium', strong: 'active-strong' }[s.level];
    bars.forEach((b, i) => {
      b.className = 'strength-bar';
      if (i < count) b.classList.add(cls);
    });
    const lbl = document.getElementById('sl');
    if (lbl) { lbl.textContent = s.label; lbl.style.color = s.color; }
  },

  async doLogin() {
    const btn = document.getElementById('login-btn');
    const email = document.getElementById('login-email').value.trim();
    const pwd = document.getElementById('login-pwd').value;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
      await ET.Auth.login(email, pwd);
      ET.Router.go('dashboard');
      ET.Screens.dashboard.render();
      ET.toast.show(`Bienvenue ${ET.Auth.currentUser.firstName} ! 👋`, 'success');
    } catch(e) {
      ET.toast.show(e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<span>Se connecter</span>';
    }
  },

  async doRegister() {
    const btn = document.getElementById('register-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
      const formData = {
        firstName: document.getElementById('reg-firstname').value.trim(),
        lastName: document.getElementById('reg-lastname').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: (document.getElementById('reg-prefix').value + ' ' + document.getElementById('reg-phone').value).trim(),
        country: document.getElementById('reg-country').value,
        city: document.getElementById('reg-city').value.trim(),
        password: document.getElementById('reg-pwd').value,
        confirmPassword: document.getElementById('reg-pwd2').value,
        acceptCGU: document.getElementById('reg-cgu').checked,
        newsletter: document.getElementById('reg-newsletter').checked,
      };
      await ET.Auth.register(formData);
      ET.Router.go('dashboard');
      ET.Screens.dashboard.render();
      ET.toast.show(`Compte créé ! Bienvenue ${ET.Auth.currentUser.firstName} 🎉`, 'success');
    } catch(e) {
      ET.toast.show(e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = 'Créer mon compte';
    }
  },

  async doReset() {
    const email = document.getElementById('reset-email').value.trim();
    try {
      await ET.Auth.requestReset(email);
      ET.toast.show('Email envoyé ! Vérifiez votre boîte mail.', 'success');
      setTimeout(() => this.switchTab('login'), 1500);
    } catch(e) {
      ET.toast.show(e.message, 'error');
    }
  }
};
