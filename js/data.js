// ═══════════════════════════════════════════════
// EMMANUEL TRADING — Data Layer
// Simulated data for all modules
// ═══════════════════════════════════════════════

window.ET = window.ET || {};
var ET = window.ET;

ET.DATA = {
  // ─── Brand Identity ──────────────────────────
  brand: {
    name: 'Emmanuel Trading',
    tagline: '« On ne promet pas la fortune. On construit des traders. »',
    email: 'contact@emmanueltrading.tg',
    phone: '+228 90 00 00 00',
    whatsapp: '22890000000', // Numero pur pour lien wa.me
    telegram: 'emmanueltrading', // Username sans @
    location: 'Lomé, Togo',
    founder: 'Emmanuel',
  },

  // ─── Formations ──────────────────────────────
  formations: [
    {
      id: 'forex-az',
      title: 'Forex de A à Z',
      subtitle: 'La formation complète pour débuter',
      level: 'Débutant',
      duration: '6-8 semaines',
      price: 80000,
      priceRange: '70 000 – 100 000',
      currency: 'FCFA',
      enrolled: 247,
      rating: 4.8,
      reviews: 89,
      status: 'available',
      color: '#1A4A7A',
      icon: '📈',
      description: 'La formation de référence pour comprendre et maîtriser le marché Forex. De zéro à votre premier trade réel, construisez des bases solides avec méthode.',
      modules: [
        {
          id: 'm1', order: 1,
          title: 'Comprendre le marché Forex',
          duration: '1h 45min',
          lessons: [
            { id: 'l1', title: "Qu'est-ce que le Forex ?", type: 'video', duration: '18min', done: true },
            { id: 'l2', title: 'Les acteurs du marché', type: 'video', duration: '22min', done: true },
            { id: 'l3', title: 'Sessions de trading mondiales', type: 'video', duration: '15min', done: true },
            { id: 'l4', title: 'Paires de devises : majeurs et mineurs', type: 'video', duration: '20min', done: false },
            { id: 'l5', title: 'Guide des paires de devises', type: 'pdf', duration: 'PDF', done: false },
            { id: 'l6', title: 'Quiz — Module 1', type: 'quiz', duration: '10 questions', done: false },
          ]
        },
        {
          id: 'm2', order: 2,
          title: 'Analyse Technique',
          duration: '3h 20min',
          lessons: [
            { id: 'l7', title: 'Lecture des graphiques en bougies', type: 'video', duration: '25min', done: false },
            { id: 'l8', title: 'Supports et Résistances', type: 'video', duration: '28min', done: false },
            { id: 'l9', title: 'Tendances : identification & confirmation', type: 'video', duration: '22min', done: false },
            { id: 'l10', title: 'Indicateurs clés : RSI, MACD, MM', type: 'video', duration: '35min', done: false },
            { id: 'l11', title: 'Cheat Sheet Analyse Technique', type: 'pdf', duration: 'PDF', done: false },
            { id: 'l12', title: 'Quiz — Module 2', type: 'quiz', duration: '15 questions', done: false },
          ]
        },
        {
          id: 'm3', order: 3,
          title: 'Analyse Fondamentale',
          duration: '2h 10min',
          lessons: [
            { id: 'l13', title: 'Calendrier économique expliqué', type: 'video', duration: '20min', done: false },
            { id: 'l14', title: 'NFP, CPI, taux directeurs', type: 'video', duration: '30min', done: false },
            { id: 'l15', title: 'Comment trader les news', type: 'video', duration: '25min', done: false },
            { id: 'l16', title: 'Quiz — Module 3', type: 'quiz', duration: '10 questions', done: false },
          ]
        },
        {
          id: 'm4', order: 4,
          title: 'Gestion du Risque & Psychologie',
          duration: '2h 30min',
          lessons: [
            { id: 'l17', title: 'La règle des 1% par trade', type: 'video', duration: '20min', done: false },
            { id: 'l18', title: 'Calcul de la taille de position', type: 'video', duration: '25min', done: false },
            { id: 'l19', title: 'Psychologie du trader gagnant', type: 'video', duration: '30min', done: false },
            { id: 'l20', title: 'Le journal de trading', type: 'video', duration: '18min', done: false },
            { id: 'l21', title: 'Modèle de journal de trading', type: 'pdf', duration: 'PDF', done: false },
            { id: 'l22', title: 'Quiz — Module 4', type: 'quiz', duration: '12 questions', done: false },
          ]
        },
        {
          id: 'm5', order: 5,
          title: 'Stratégies de Trading',
          duration: '3h 00min',
          lessons: [
            { id: 'l23', title: 'Stratégie Price Action', type: 'video', duration: '35min', done: false },
            { id: 'l24', title: 'Stratégie breakout', type: 'video', duration: '28min', done: false },
            { id: 'l25', title: 'Stratégie sur les retracements', type: 'video', duration: '32min', done: false },
            { id: 'l26', title: 'Backtesting de vos stratégies', type: 'video', duration: '25min', done: false },
            { id: 'l27', title: 'Quiz — Module 5', type: 'quiz', duration: '15 questions', done: false },
          ]
        },
        {
          id: 'm6', order: 6,
          title: 'Plan de Trading & Passage au Réel',
          duration: '1h 45min',
          lessons: [
            { id: 'l28', title: 'Construire son plan de trading', type: 'video', duration: '30min', done: false },
            { id: 'l29', title: 'Choisir son broker', type: 'video', duration: '20min', done: false },
            { id: 'l30', title: 'Ouverture de compte démo vs réel', type: 'video', duration: '15min', done: false },
            { id: 'l31', title: 'Template Plan de Trading', type: 'pdf', duration: 'PDF', done: false },
            { id: 'l32', title: 'Projet Final', type: 'quiz', duration: 'Évaluation', done: false },
          ]
        }
      ],
      testimonials: [
        { name: 'Kofi A.', city: 'Lomé', text: 'Formation sérieuse, rien à voir avec les arnaques sur internet. J\'ai appris à perdre moins et à gagner avec méthode.', rating: 5 },
        { name: 'Fatou D.', city: 'Dakar', text: 'Le module sur la gestion du risque m\'a tout changé. Maintenant je trade sans stress.', rating: 5 },
        { name: 'Ibrahim S.', city: 'Abidjan', text: 'Emmanuel explique simplement des concepts complexes. Parfait pour débutants.', rating: 4 },
      ]
    },
    {
      id: 'trading-avance',
      title: 'Trading Avancé',
      subtitle: 'Stratégies professionnelles & prop firms',
      level: 'Intermédiaire',
      duration: 'En création',
      price: null,
      status: 'coming-soon',
      color: '#7C3AED',
      icon: '🚀',
      description: 'Pour ceux qui ont terminé le niveau débutant. Stratégies avancées, SMC, ICT, et préparation aux challenges prop firms.',
      modules: []
    }
  ],

  // ─── Analyses ─────────────────────────────────
  analyses: [
    {
      id: 'a1',
      pair: 'EUR/USD',
      title: 'EUR/USD — Biais haussier sur H4 avant NFP',
      date: '2026-04-07',
      timeframe: 'H4',
      type: 'technique',
      bias: 'bullish',
      access: 'free',
      summary: "Le cours consolide sur un support clé à 1.0820. La structure de marché reste haussière sur H4 avec des Higher Highs et Higher Lows bien formés.",
      fullText: "L'EUR/USD affiche une structure de marché clairement haussière sur le timeframe H4. Après une correction de 180 pips depuis le plus haut de 1.1050, le cours trouve un support solide en zone 1.0820-1.0840.\n\nLa zone de support coïncide avec :\n• La MA200 sur le H4\n• Un niveau de retracement Fibonacci à 61.8%\n• Un ancien niveau de résistance converti en support\n\nLe RSI diverge positivement sur H4, confirmant un essoufflement baissier. Nous anticipons une reprise vers 1.0950 avant publication des chiffres NFP vendredi.",
      support: '1.0820',
      resistance: '1.0950',
      entry: '1.0840',
      stop: '1.0790',
      target: '1.0950',
      chartUrl: null,
      updatedAt: '2026-04-07T08:30:00Z'
    },
    {
      id: 'a2',
      pair: 'XAU/USD',
      title: 'OR — Zone de distribution à surveiller',
      date: '2026-04-06',
      timeframe: 'D1',
      type: 'technique',
      bias: 'bearish',
      access: 'premium',
      summary: "L'or teste la résistance majeure à 2380$. La divergence baissière sur RSI journalier suggère un risque de correction.",
      fullText: "L'or (XAU/USD) approche d'une zone de résistance majeure identifiée à 2380$. Historiquement, ce niveau a repoussé plusieurs tentatives haussières.\n\nSignaux de retournement potentiel :\n• Divergence baissière RSI sur D1\n• Bougie en étoile du soir en formation\n• Volume en baisse sur la dernière montée\n\nEn cas de clôture journalière sous 2360$, nous anticipons une correction vers 2310-2320$.",
      support: '2300',
      resistance: '2380',
      entry: '2360',
      stop: '2395',
      target: '2310',
      chartUrl: null
    },
    {
      id: 'a3',
      pair: 'GBP/USD',
      title: 'GBP/USD — Breakout attendu sur triangle',
      date: '2026-04-05',
      timeframe: 'H1',
      type: 'fondamentale',
      bias: 'neutral',
      access: 'free',
      summary: "Consolidation en triangle symétrique sur H1. Attente du BOE pour confirmation directionnelle.",
      fullText: "Le GBP/USD forme un triangle symétrique sur le H1. Ce pattern de continuation indique une indécision avant une décision de Bank of England attendue jeudi.\n\nScénario haussier (au-dessus de 1.2680) : cible 1.2750\nScénario baissier (sous 1.2620) : cible 1.2550\n\nNous conseillons d'attendre la cassure claire avant positionnement.",
      support: '1.2620',
      resistance: '1.2680',
      entry: 'Sur cassure confirmée',
      stop: '30 pips',
      target: '60 pips',
      chartUrl: null
    },
    {
      id: 'a4',
      pair: 'EUR/USD',
      title: 'Analyse Hebdomadaire — Semaine du 7 avril',
      date: '2026-04-07',
      timeframe: 'W1',
      type: 'hebdomadaire',
      bias: 'bullish',
      access: 'premium',
      summary: "Revue hebdomadaire complète des marchés Forex avec focus sur les événements économiques majeurs de la semaine.",
      fullText: "Bilan de la semaine passée et perspectives pour la semaine du 7 avril 2026.\n\nÉvénements majeurs à surveiller :\n• Lundi 7 : Discours Fed - Impact potentiel élevé\n• Mercredi 9 : CPI US - Impact très élevé\n• Vendredi 11 : NFP - Impact très élevé\n\nPositionnement suggéré : prudence en début de semaine avant CPI.",
      support: '1.0780',
      resistance: '1.1020',
      entry: 'Selon signal journalier',
      stop: 'Selon gestion du risque',
      target: 'Multiple selon entrée',
      chartUrl: null
    }
  ],

  // ─── Economic Calendar ─────────────────────────
  econCalendar: [
    { id: 'ec1', name: 'Non-Farm Payrolls (NFP)', pair: 'USD', impact: 'high', time: '14:30', date: '2026-04-11', actual: null, forecast: '165K', previous: '151K' },
    { id: 'ec2', name: 'Taux directeur BCE', pair: 'EUR', impact: 'high', time: '13:45', date: '2026-04-10', actual: null, forecast: '3.25%', forecast: '3.25%', previous: '3.50%' },
    { id: 'ec3', name: 'CPI Inflation US', pair: 'USD', impact: 'high', time: '14:30', date: '2026-04-09', actual: null, forecast: '3.1%', previous: '3.2%' },
    { id: 'ec4', name: 'PIB Zone Euro', pair: 'EUR', impact: 'medium', time: '10:00', date: '2026-04-08', actual: null, forecast: '0.2%', previous: '0.1%' },
    { id: 'ec5', name: 'ISM Services US', pair: 'USD', impact: 'medium', time: '16:00', date: '2026-04-08', actual: null, forecast: '54.0', previous: '53.5' },
    { id: 'ec6', name: 'Discours Fed Powell', pair: 'USD', impact: 'high', time: '19:00', date: '2026-04-07', actual: null, forecast: '–', previous: '–' },
    { id: 'ec7', name: 'Claims emploi US', pair: 'USD', impact: 'low', time: '14:30', date: '2026-04-10', actual: null, forecast: '220K', previous: '218K' },
  ],

  // ─── Forum Posts ──────────────────────────────
  forumPosts: [
    {
      id: 'fp1', pinned: true,
      author: 'Emmanuel', authorLevel: 'Confirmé', authorInitials: 'E',
      time: 'Il y a 2h',
      title: '📌 Règles de la communauté — À lire absolument',
      preview: 'Bienvenue dans la communauté Emmanuel Trading ! Voici les règles de base pour une ambiance saine et professionnelle dans ce forum...',
      likes: 48, replies: 12, category: 'Annonce'
    },
    {
      id: 'fp2', pinned: false,
      author: 'Kofi Mensah', authorLevel: 'Intermédiaire', authorInitials: 'KM',
      time: 'Il y a 4h',
      title: 'Question sur le calcul de la taille de position',
      preview: 'Je ne comprends pas comment calculer la taille de position quand j\'ai un compte de 500$ et un SL de 30 pips...',
      likes: 14, replies: 8, category: 'Questions'
    },
    {
      id: 'fp3', pinned: false,
      author: 'Fatou Diallo', authorLevel: 'Débutant', authorInitials: 'FD',
      time: 'Il y a 1j',
      title: 'Ma première semaine profitable en démo ! 🎉',
      preview: 'Après 3 semaines de formation, j\'ai enfin terminé une semaine en démo avec +4.2% sans violer mes règles...',
      likes: 67, replies: 23, category: 'Partage'
    },
    {
      id: 'fp4', pinned: false,
      author: 'Ibrahim Sanogo', authorLevel: 'Intermédiaire', authorInitials: 'IS',
      time: 'Il y a 2j',
      title: 'Analyse EUR/USD — Niveau support critique',
      preview: 'En regardant le H4, je vois une zone clé entre 1.0820 et 1.0840 qui a déjà repoussé le cours 3 fois...',
      likes: 31, replies: 15, category: 'Analyses'
    },
    {
      id: 'fp5', pinned: false,
      author: 'Aïcha Traoré', authorLevel: 'Débutant', authorInitials: 'AT',
      time: 'Il y a 3j',
      title: 'Différence entre lot, mini-lot et micro-lot ?',
      preview: 'Bonjour à tous, je débute et je bloque sur la notion de lot. Est-ce que quelqu\'un peut expliquer simplement ?',
      likes: 22, replies: 19, category: 'Questions'
    }
  ],

  // ─── Coaching Slots ───────────────────────────
  coachingSlots: {
    '2026-04-07': ['09:00', '11:00'],
    '2026-04-08': ['14:00', '16:00', '18:00'],
    '2026-04-09': ['10:00'],
    '2026-04-10': ['09:00', '11:00', '14:00'],
    '2026-04-11': [],
    '2026-04-14': ['09:00', '11:00', '16:00'],
    '2026-04-15': ['14:00', '18:00'],
  },

  coachingSessions: [
    { id: 'cs1', date: '2026-03-20', time: '10:00', duration: 60, status: 'done', notes: 'Revue du journal. Travail sur la gestion émotionnelle. Plan d\'action semaine.' },
    { id: 'cs2', date: '2026-03-05', time: '14:00', duration: 60, status: 'done', notes: 'Introduction stratégie Price Action. Exercices pratiques.' },
  ],

  // ─── Pricing Plans ────────────────────────────
  plans: [
    {
      id: 'essentiel',
      name: 'Essentiel',
      price: 0,
      period: 'Gratuit',
      featured: false,
      features: [
        'Accès au contenu éducatif de base',
        'Groupe Telegram communautaire',
        '1 analyse gratuite par semaine',
        'Quiz d\'auto-évaluation',
      ],
      cta: 'Votre offre actuelle',
      disabled: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 7500,
      period: '/ mois',
      featured: true,
      features: [
        'Analyses quotidiennes exclusives',
        'Signaux commentés avec raisonnement',
        'Forum communauté premium',
        'Replays sessions live',
        '-20% sur toutes les formations',
        'Calendrier économique alertes',
      ],
      cta: 'Démarrer Premium',
      disabled: false
    },
    {
      id: 'elite',
      name: 'Élite',
      price: 75000,
      period: 'accès complet',
      featured: false,
      features: [
        'Formation Forex de A à Z incluse',
        'Tout l\'abonnement Premium',
        '3 sessions coaching individuel',
        'Certificat de formation',
        'Support prioritaire',
        'Économie de 30% vs séparé',
      ],
      cta: 'Accès Élite',
      disabled: false
    }
  ],

  // ─── Transactions ─────────────────────────────
  transactions: [
    { id: 't1', name: 'Abonnement Premium', date: '2026-04-01', amount: 7500, type: 'debit', status: 'success', method: 'Wave' },
    { id: 't2', name: 'Formation Forex A→Z', date: '2026-02-15', amount: 30000, type: 'debit', status: 'success', method: 'Flooz' },
    { id: 't3', name: 'Commission parrainage', date: '2026-03-22', amount: 4500, type: 'credit', status: 'success', method: 'Wave' },
  ],

  // ─── Notifications ────────────────────────────
  notifications: [
    { id: 'n1', type: 'analysis', icon: '📊', iconBg: 'rgba(26,74,122,.15)', iconColor: '#1A4A7A', title: 'Nouvelle analyse publiée', body: 'EUR/USD — Biais haussier sur H4 avant NFP', time: 'Il y a 2h', read: false },
    { id: 'n2', type: 'payment', icon: '✅', iconBg: 'rgba(26,122,74,.15)', iconColor: '#1A7A4A', title: 'Paiement confirmé', body: 'Votre abonnement Premium a été renouvelé avec succès', time: 'Il y a 1j', read: false },
    { id: 'n3', type: 'forum', icon: '💬', iconBg: 'rgba(212,160,23,.15)', iconColor: '#A87A0F', title: 'Réponse à votre post', body: 'Kofi a répondu à votre question sur la taille de position', time: 'Il y a 3h', read: true },
    { id: 'n4', type: 'coaching', icon: '🎯', iconBg: 'rgba(124,58,237,.15)', iconColor: '#7C3AED', title: 'Rappel coaching', body: 'Votre session avec Emmanuel est demain à 10h00', time: 'Il y a 5h', read: true },
    { id: 'n5', type: 'formation', icon: '📚', iconBg: 'rgba(26,74,122,.12)', iconColor: '#1A4A7A', title: 'Nouveau contenu disponible', body: 'Module 2 — Leçon 4 : Indicateurs clés RSI, MACD…', time: 'Il y a 2j', read: true },
    { id: 'n6', type: 'market', icon: '⚡', iconBg: 'rgba(192,57,43,.12)', iconColor: '#C0392B', title: 'Événement économique dans 30min', body: 'NFP US — Impact très élevé (USD)', time: 'Il y a 3j', read: true },
    { id: 'n7', type: 'analysis', icon: '📊', iconBg: 'rgba(26,74,122,.15)', iconColor: '#1A4A7A', title: 'Analyse mise à jour', body: 'XAU/USD — Zone de distribution confirmée', time: 'Il y a 3j', read: true },
  ],

  // ─── FAQ ──────────────────────────────────────
  faq: [
    {
      q: 'Comment accéder à ma formation après l\'achat ?',
      a: 'Après confirmation du paiement, votre accès est activé immédiatement. Allez dans "Formations" → sélectionnez votre formation → commencez la leçon 1. L\'accès est à vie.'
    },
    {
      q: 'Comment payer avec Wave Money ?',
      a: 'Sur la page de paiement, sélectionnez "Wave". Entrez votre numéro Wave et confirmez le paiement dans l\'application Wave. L\'accès est activé dans les 2 minutes.'
    },
    {
      q: 'Comment rejoindre le groupe Telegram ?',
      a: 'Dans l\'onglet "Communauté", cliquez sur "Rejoindre le groupe Telegram gratuit". Installez Telegram si ce n\'est pas déjà fait, puis cliquez sur le lien d\'invitation.'
    },
    {
      q: 'Comment obtenir mon certificat de formation ?',
      a: 'Terminez tous les modules, réussissez tous les quiz avec 70% minimum et soumettez votre projet final. Le certificat PDF est généré automatiquement et envoyé par email.'
    },
    {
      q: 'Comment annuler mon abonnement Premium ?',
      a: 'Allez dans Profil → Abonnements → Gérer → Désactiver le renouvellement automatique. Votre accès Premium reste actif jusqu\'à la fin de la période payée.'
    },
    {
      q: 'Le trading est-il halal ?',
      a: 'C\'est une question importante. Le trading peut être pratiqué de manière conforme à la finance islamique avec des comptes "swap-free". Nous recommandons de consulter un érudit islamique pour votre situation personnelle. Certains brokers proposent des comptes islamiques dédiés.'
    },
    {
      q: 'Quelle est la différence entre compte démo et compte réel ?',
      a: 'Le compte démo utilise de l\'argent virtuel — aucun risque financier. Il sert à pratiquer et tester vos stratégies. Le compte réel utilise votre argent. Nous recommandons au moins 3 mois de démo profitable avant de passer au réel.'
    }
  ],

  // ─── Market Prices (simulation) ───────────────
  marketPrices: {
    'EUR/USD': { ask: 1.0856, bid: 1.0854, change: 0.0023, changePct: 0.21 },
    'GBP/USD': { ask: 1.2645, bid: 1.2643, change: -0.0012, changePct: -0.09 },
    'XAU/USD': { ask: 2348.50, bid: 2348.10, change: 12.30, changePct: 0.53 },
    'USD/JPY': { ask: 151.82, bid: 151.80, change: 0.45, changePct: 0.30 },
    'USD/XOF': { ask: 612.50, bid: 612.00, change: 1.20, changePct: 0.20 },
  }
};

// Data layer ready
