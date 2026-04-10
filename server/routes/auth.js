/**
 * EMMANUEL TRADING — Auth Routes
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DB_PATH = path.join(__dirname, '../data/db.json');

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const saveDB = (db) => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, country, city } = req.body;
  const db = getDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    firstName, lastName, email, phone, country, city,
    password: hashedPassword,
    plan: 'essentiel',
    verified: false,
    referralCode: `ET${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: newUser.id, firstName, lastName, email, plan: 'essentiel' } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email, plan: user.plan } });
});

module.exports = router;
