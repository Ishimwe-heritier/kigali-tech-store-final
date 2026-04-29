require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'kigali_tech_secret_key'; // Mock secret key

app.use(cors());
app.use(express.json());

// Helper to read and write data files
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data || '[]');
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = readData('users.json');
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password // Storing in plain text for mock purposes only
  };

  users.push(newUser);
  writeData('users.json', users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
  res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// --- PROFILE ROUTES ---
app.get('/api/profile', verifyToken, (req, res) => {
  const users = readData('users.json');
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// --- PRODUCT ROUTES ---
app.get('/api/products', (req, res) => {
  const products = readData('products.json');
  res.json(products);
});

// --- CART ROUTES ---
app.get('/api/cart', verifyToken, (req, res) => {
  const carts = readData('carts.json');
  const userCart = carts.find(c => c.userId === req.userId) || { userId: req.userId, items: [] };
  res.json(userCart);
});

app.post('/api/cart', verifyToken, (req, res) => {
  const { items } = req.body;
  const carts = readData('carts.json');
  let userCartIndex = carts.findIndex(c => c.userId === req.userId);

  if (userCartIndex === -1) {
    carts.push({ userId: req.userId, items });
  } else {
    carts[userCartIndex].items = items;
  }

  writeData('carts.json', carts);
  res.json({ message: 'Cart updated successfully' });
});

// --- WISHLIST ROUTES ---
app.get('/api/wishlist', verifyToken, (req, res) => {
  const wishlists = readData('wishlists.json');
  const userWishlist = wishlists.find(w => w.userId === req.userId) || { userId: req.userId, items: [] };
  res.json(userWishlist);
});

app.post('/api/wishlist', verifyToken, (req, res) => {
  const { items } = req.body;
  const wishlists = readData('wishlists.json');
  let userWishlistIndex = wishlists.findIndex(w => w.userId === req.userId);

  if (userWishlistIndex === -1) {
    wishlists.push({ userId: req.userId, items });
  } else {
    wishlists[userWishlistIndex].items = items;
  }

  writeData('wishlists.json', wishlists);
  res.json({ message: 'Wishlist updated successfully' });
});

// --- ORDER ROUTES ---
app.post('/api/orders', verifyToken, (req, res) => {
  const { items, total, paymentIntentId } = req.body;
  const orders = readData('orders.json');
  
  const newOrder = {
    id: `ORD-${Date.now()}`,
    userId: req.userId,
    items,
    total,
    paymentIntentId,
    date: new Date().toISOString(),
    status: 'paid'
  };

  orders.push(newOrder);
  writeData('orders.json', orders);
  res.status(201).json(newOrder);
});

app.get('/api/orders', verifyToken, (req, res) => {
  const orders = readData('orders.json');
  const userOrders = orders.filter(o => o.userId === req.userId);
  res.json(userOrders);
});

// --- STRIPE PAYMENT INTENT ---
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount should be in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
