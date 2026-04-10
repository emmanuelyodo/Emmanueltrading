// ═══════════════════════════════════════════════
// EMMANUEL TRADING — Auth Module
// Registration, Login, Session Management
// ═══════════════════════════════════════════════

window.ET = window.ET || {};
var ET = window.ET;

ET.Auth = {
  // ─── State ────────────────────────────────────
  currentUser: null,
  TOKEN_KEY: 'et_auth_token',
  USER_KEY:  'et_user_data',

  // ─── Init ─────────────────────────────────────
  init() {
    this.loadSession();
  },

  loadSession() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userData = localStorage.getItem(this.USER_KEY);
      if (token && userData) {
        this.currentUser = JSON.parse(userData);
        return true;
      }
    } catch(e) {}
    return false;
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  // ─── Register ─────────────────────────────────
  async register(formData) {
    // Simulate API call
    await this._delay(1000);

    // Validation
    if (!formData.firstName || !formData.lastName) throw new Error('Prénom et nom obligatoires');
    if (!this._isValidEmail(formData.email)) throw new Error('Format d\'email invalide');
    if (formData.password.length < 8) throw new Error('Mot de passe : minimum 8 caractères');
    if (formData.password !== formData.confirmPassword) throw new Error('Les mots de passe ne correspondent pas');
    if (!formData.acceptCGU) throw new Error('Vous devez accepter les CGU');

    // Check if email already exists (simulate)
    const existingUsers = JSON.parse(localStorage.getItem('et_all_users') || '[]');
    if (existingUsers.find(u => u.email === formData.email)) {
      throw new Error('Un compte existe déjà avec cet email');
    }

    const user = {
      id: 'usr_' + Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      country: formData.country || 'Togo',
      city: formData.city || '',
      plan: 'essentiel',
      avatar: null,
      tradingLevel: 'Débutant',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      newsletter: formData.newsletter || false,
      emailVerified: false,
      referralCode: 'ET' + Math.random().toString(36).substr(2,6).toUpperCase(),
      referredBy: formData.referralCode || null,
      stats: {
        modulesCompleted: 0,
        quizPassed: 0,
        daysActive: 1,
        currentFormation: 'forex-az',
        currentModule: 'm1',
        currentLesson: 'l4',
        progress: 15,
      }
    };

    // Save
    existingUsers.push(user);
    localStorage.setItem('et_all_users', JSON.stringify(existingUsers));
    this._saveSession(user);

    // Simulate welcome email
    console.log(`[EMAIL] Bienvenue sur Emmanuel Trading, ${user.firstName} !`);

    return user;
  },

  // ─── Login ────────────────────────────────────
  async login(email, password) {
    await this._delay(800);

    if (!email || !password) throw new Error('Email et mot de passe requis');
    if (!this._isValidEmail(email)) throw new Error('Format d\'email invalide');

    const existingUsers = JSON.parse(localStorage.getItem('et_all_users') || '[]');
    const user = existingUsers.find(u => u.email === email);

    // Demo account always works
    if (email === 'demo@emmanueltrading.tg' || (user && password.length >= 8)) {
      const loginUser = user || {
        id: 'usr_demo',
        firstName: 'Kofi',
        lastName: 'Mensah',
        email: email,
        phone: '+228 90 00 00 00',
        country: 'Togo',
        city: 'Lomé',
        plan: 'premium',
        avatar: null,
        tradingLevel: 'Intermédiaire',
        createdAt: '2026-01-15T00:00:00Z',
        lastLogin: new Date().toISOString(),
        newsletter: true,
        emailVerified: true,
        referralCode: 'ETDEMO2026',
        stats: {
          modulesCompleted: 3,
          quizPassed: 12,
          daysActive: 42,
          currentFormation: 'forex-az',
          currentModule: 'm4',
          currentLesson: 'l18',
          progress: 52,
        }
      };
      loginUser.lastLogin = new Date().toISOString();
      this._saveSession(loginUser);
      return loginUser;
    }

    throw new Error('Email ou mot de passe incorrect');
  },

  // ─── Logout ───────────────────────────────────
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  // ─── Password Reset ───────────────────────────
  async requestReset(email) {
    await this._delay(800);
    if (!this._isValidEmail(email)) throw new Error('Format d\'email invalide');
    console.log(`[EMAIL] Lien de réinitialisation envoyé à ${email}`);
    return true;
  },

  // ─── Update Profile ───────────────────────────
  updateProfile(updates) {
    this.currentUser = { ...this.currentUser, ...updates };
    localStorage.setItem(this.USER_KEY, JSON.stringify(this.currentUser));

    // Also update in all_users
    const existingUsers = JSON.parse(localStorage.getItem('et_all_users') || '[]');
    const idx = existingUsers.findIndex(u => u.id === this.currentUser.id);
    if (idx >= 0) {
      existingUsers[idx] = this.currentUser;
      localStorage.setItem('et_all_users', JSON.stringify(existingUsers));
    }
  },

  // ─── Update Progress ──────────────────────────
  updateProgress(lessonId, done) {
    if (!this.currentUser) return;
    // In a real app, this would call the API
    const lesson = this._findLesson(lessonId);
    if (lesson) {
      lesson.done = done;
      localStorage.setItem('et_lesson_' + lessonId, done ? '1' : '0');
    }
  },

  getLessonDone(lessonId) {
    return localStorage.getItem('et_lesson_' + lessonId) === '1';
  },

  // ─── Helpers ──────────────────────────────────
  _saveSession(user) {
    const token = 'jwt_sim_' + Date.now() + '_' + Math.random().toString(36).substr(2);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser = user;
  },

  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  _findLesson(lessonId) {
    for (const formation of ET.DATA.formations) {
      for (const mod of formation.modules) {
        const lesson = mod.lessons.find(l => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
    return null;
  },

  getInitials() {
    if (!this.currentUser) return '?';
    return (this.currentUser.firstName[0] + this.currentUser.lastName[0]).toUpperCase();
  },

  getFullName() {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  },

  passwordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { level: 'weak', label: 'Faible', color: 'var(--red)' };
    if (score <= 3) return { level: 'medium', label: 'Moyen', color: '#F59E0B' };
    return { level: 'strong', label: 'Fort', color: 'var(--green)' };
  }
};
