const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://technology:mLtQuWzm1UrCAyoZ@cluster0.2akwggi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://link.odinschool.com',
    'https://www.link.odinschool.com',
    'https://0din.link',
    'https://www.0din.link'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Handle preflight
app.options('*', cors());

app.use(express.json());

// URL model
const Url = mongoose.model('Url', new mongoose.Schema({
  full: String,
  short: String
}));

app.post('/shorten', async (req, res) => {
  try {
    const { full } = req.body;
    const short = shortid.generate();
    const url = new Url({ full, short });
    await url.save();
    res.json({ short });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

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
