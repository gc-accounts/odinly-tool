const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
const app = express();

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://technology:mLtQuWzm1UrCAyoZ@cluster0.2akwggi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://link.odinschool.com'  // 🚫 do not modify as per your instruction
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials','true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // ✅ Handles preflight
  }

  next();
});

app.use(express.json());

// ✅ URL Model
const Url = mongoose.model('Url', new mongoose.Schema({
  full: String,
  short: String
}));

// ✅ Create short URL
app.post('/shorten', async (req, res) => {
  try {
    let { full } = req.body;

    // Ensure the URL has a protocol
    if (!/^https?:\/\//i.test(full)) {
      full = 'https://' + full;
    }

    const short = shortid.generate();
    const url = new Url({ full, short });
    await url.save();
    res.json({ short });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});


// ✅ Redirect route
app.get('/:short', async (req, res) => {
  try {
    const url = await Url.findOne({ short: req.params.short });
    if (!url) return res.sendStatus(404);
    res.redirect(url.full);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = app;
