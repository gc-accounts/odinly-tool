const express = require('express');
const app = express(); // ✅ Make sure this is here
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Middleware
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
