const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
const app = express();

// ✅ MongoDB connection
mongoose.connect(
  'mongodb+srv://technology:mLtQuWzm1UrCAyoZ@cluster0.2akwggi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // ⬅️ Increased timeout
  }
);

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://link.odinschool.com', // Do not modify
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// ✅ Define model safely (prevent redefinition error)
const urlSchema = new mongoose.Schema({
  full: { type: String, required: true },
  short: { type: String, required: true, unique: true },
});
const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

// ✅ POST /shorten route
app.post('/shorten', async (req, res) => {
  try {
    let { full } = req.body;

    if (!full || typeof full !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing full URL' });
    }

    // Ensure URL starts with http/https
    if (!/^https?:\/\//i.test(full)) {
      full = 'https://' + full;
    }

    const short = shortid.generate();
    const url = new Url({ full, short });

    console.log('📦 Inserting URL:', url);
    await url.save();

    res.status(200).json({ short });
  } catch (err) {
    console.error('❌ Failed to shorten URL:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ✅ GET /:short redirect
app.get('/:short', async (req, res) => {
  try {
    const url = await Url.findOne({ short: req.params.short });
    if (!url) return res.status(404).json({ message: 'Short URL not found' });

    res.redirect(url.full);
  } catch (err) {
    console.error('❌ Redirect failed:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = app;
