const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

// MongoDB connection
mongoose.connect('mongodb+srv://technology:mLtQuWzm1UrCAyoZ@cluster0.2akwggi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// CORS configuration for frontend and localhost
app.use(cors({
  origin: ['http://localhost:3000', 'https://odinly-tool.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// URL model
const Url = mongoose.model('Url', new mongoose.Schema({
  full: String,
  short: String
}));

// Create short URL
app.post('/shorten', async (req, res) => {
  const { full } = req.body;
  const short = shortid.generate();
  const url = new Url({ full, short });
  await url.save();
  res.json({ short });
});

// Redirect route
app.get('/:short', async (req, res) => {
  const url = await Url.findOne({ short: req.params.short });
  if (!url) return res.sendStatus(404);
  res.redirect(url.full);
});

// Vercel expects you to export the handler (no need for app.listen)
module.exports = app;
