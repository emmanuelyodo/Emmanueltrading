/**
 * EMMANUEL TRADING — Payment Routes
 * Integration stubs for FedaPay, CinetPay, and Stripe.
 */

const express = require('express');
const router = express.Router();

// Mock payment initiation
router.post('/initiate', async (req, res) => {
  const { amount, method, product } = req.body;

  // LOGIC FOR FEDAPAY (Togo)
  if (['wave', 'flooz', 'tmoney'].includes(method)) {
    console.log(`[FEDAPAY] Initiating ${method} payment for ${amount} FCFA`);
    return res.json({ 
      status: 'pending',
      payment_url: `https://fedapay.com/pay/demo?amount=${amount}&currency=XOF`,
      transaction_id: `ET_FED_${Date.now()}`
    });
  }

  // LOGIC FOR STRIPE (International)
  if (method === 'card') {
    console.log(`[STRIPE] Creating payment intent for ${amount} XOF`);
    return res.json({
      status: 'pending',
      client_secret: 'pi_demo_secret',
      transaction_id: `ET_STR_${Date.now()}`
    });
  }

  res.status(400).json({ error: 'Méthode de paiement non supportée' });
});

// Webhook for payment confirmation
router.post('/webhook', (req, res) => {
  const { transaction_id, status } = req.body;
  console.log(`[WEBHOOK] Transaction ${transaction_id} updated to ${status}`);
  // Update DB and send confirmation email here
  res.status(200).send('OK');
});

module.exports = router;
