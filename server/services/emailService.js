/**
 * EMMANUEL TRADING — Email Service
 * Handles transactional emails as requested in the specs.
 */

const nodemailer = require('nodemailer');

// Mock transporter for demonstration (use SendGrid/Brevo in prod)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: 'mock_user',
    pass: 'mock_pass',
  },
});

const EMAIL_TEMPLATES = {
  INSCRIPTION: (firstName) => ({
    subject: `Bienvenue sur Emmanuel Trading, ${firstName} !`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 16px; background: #0D2137; color: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4A017; margin: 0; font-size: 28px;">Bienvenue, ${firstName} 🎓</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">Nous sommes ravis de vous accueillir dans la communauté d'Emmanuel Trading. Le chemin vers la maîtrise des marchés commence ici.</p>
        <p style="font-size: 16px; line-height: 1.6;">Pour activer toutes les fonctionnalités et accéder à vos ressources gratuites, merci de vérifier votre adresse email :</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="{{VERIFY_LINK}}" style="background: #D4A017; color: #0D2137; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block;">ACTIVER MON COMPTE</a>
        </div>
        <hr style="border: none; border-top: 1px solid rgba(212,160,23,0.3); margin: 30px 0;">
        <p style="font-size: 14px; color: #8896AB; text-align: center;"><em>« On ne promet pas la fortune. On construit des traders. »</em></p>
      </div>
    `
  }),
  VERIFY_EMAIL: (firstName) => ({
    subject: "Confirmez votre adresse email",
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px;">
      <h2 style="color:#D4A017">Vérifiez votre email</h2>
      <p>Bonjour ${firstName}, plus qu'une étape pour sécuriser votre compte. Cliquez sur le bouton ci-dessous :</p>
      <a href="{{VERIFY_LINK}}" style="background:#D4A017; color:#0D2137; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; margin-top:20px;">CONFIRMER L'EMAIL</a>
    </div>`
  }),
  PURCHASE_CONFIRM: (firstName, product, amount) => ({
    subject: `Confirmation d'achat : ${product}`,
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px;">
      <h2 style="color:#1A7A4A">Paiement Réussi ✅</h2>
      <p>Bonjour ${firstName}, votre commande pour <strong>${product}</strong> a été validée.</p>
      <p style="font-size:24px; font-weight:bold; color:#D4A017;">Montant : ${amount} FCFA</p>
      <p>Vous avez maintenant un accès complet au contenu dans votre application.</p>
      <a href="{{APP_LINK}}" style="background:#D4A017; color:#0D2137; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; margin-top:20px;">ACCÉDER AU CONTENU</a>
    </div>`
  }),
  INACTIVITY_REMINDER: (firstName) => ({
    subject: `${firstName}, reprenez votre formation ! 📈`,
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px;">
      <h2 style="color:#D4A017">Ne perdez pas le fil !</h2>
      <p>Bonjour ${firstName}, cela fait 3 jours que vous n'avez pas progressé dans vos cours.</p>
      <p>La discipline est la clé de la réussite en trading. Emmanuel vous attend pour le prochain module.</p>
      <a href="{{APP_LINK}}" style="background:#D4A017; color:#0D2137; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; margin-top:20px;">CONTINUER À APPRENDRE</a>
    </div>`
  }),
  SUB_EXPIRING_7D: (firstName) => ({
    subject: "Alerte : Votre accès Premium expire bientôt",
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px; border:1px solid #D4A017;">
      <h2 style="color:#D4A017">Attention Expiration Proche ⚠️</h2>
      <p>Bonjour ${firstName}, votre abonnement expire dans <strong>7 jours</strong>.</p>
      <p>Renouvelez-le maintenant pour conserver l'accès aux analyses quotidiennes et aux signaux communautaires.</p>
      <a href="{{RENEW_LINK}}" style="background:#D4A017; color:#0D2137; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; margin-top:20px;">RENOUVELER MON ACCÈS</a>
    </div>`
  }),
  SUB_EXPIRED: (firstName) => ({
    subject: "Votre accès Premium a expiré",
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px;">
      <h2 style="color:#C0392B">Accès Expiré ❌</h2>
      <p>Bonjour ${firstName}, vous ne bénéficiez plus des avantages Premium.</p>
      <p>Ne manquez pas les prochaines opportunités de marché. Revenez parmi nous !</p>
      <a href="{{SUB_LINK}}" style="background:#D4A017; color:#0D2137; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block; margin-top:20px;">REPENDRE MON ABONNEMENT</a>
    </div>`
  }),
  COACHING_CONFIRM: (firstName, date, time) => ({
    subject: "Confirmation de votre session Coaching 🎯",
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:12px;">
      <h2 style="color:#D4A017">Session Confirmée</h2>
      <p>Bonjour ${firstName}, votre session de coaching individuel est réservée :</p>
      <p style="font-size:20px; color:#D4A017;">📅 <strong>${date} à ${time}</strong></p>
      <p>Emmanuel se connectera avec vous via le lien de réunion disponible dans votre dashboard.</p>
      <p>Veuillez préparer vos questions pour maximiser cette session.</p>
    </div>`
  }),
  CERTIFICATE_READY: (firstName, formationName) => ({
    subject: `Félicitations ! Votre certificat est prêt 🎉`,
    html: `<div style="background:#0D2137; color:#fff; padding:40px; font-family:sans-serif; border-radius:16px; text-align:center; border:2px solid #D4A017;">
      <h1 style="color:#D4A017">Félicitations ${firstName} !</h1>
      <p style="font-size:18px;">Vous avez brillamment terminé la formation :</p>
      <h2 style="color:#fff">${formationName}</h2>
      <div style="margin:40px 0;">
        <span style="font-size:60px;">🏆</span>
      </div>
      <p>Votre certificat officiel Emmanuel Trading est désormais disponible. Vous pouvez le télécharger via l'application ou en cliquant ci-dessous.</p>
      <a href="{{CERT_LINK}}" style="background:#D4A017; color:#0D2137; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px; display:inline-block;">TÉLÉCHARGER MON CERTIFICAT (PDF)</a>
    </div>`
  })
};

const sendEmail = async (to, templateKey, params) => {
  const template = EMAIL_TEMPLATES[templateKey](...params);
  if (!template) return console.error('Template not found:', templateKey);

  console.log(`[EMAIL SENDING] To: ${to} | Subject: ${template.subject}`);
  // In production, uncomment:
  // await transporter.sendMail({ from: '"Emmanuel Trading" <contact@emmanueltrading.tg>', to, ...template });
};

module.exports = { sendEmail };
