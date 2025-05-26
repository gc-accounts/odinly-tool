import  { useState, useEffect } from 'react';
import axios from 'axios';
import { MdContentCopy } from 'react-icons/md';
import './App.css';

function App() {
  const [form, setForm] = useState({
    websiteUrl: '',
    campaignId: '',
    source: '',
    medium: '',
    campaignName: '',
    term: '',
    content: ''
  });

  const [fullUrl, setFullUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  useEffect(() => {
    if (form.websiteUrl) {
      const params = new URLSearchParams();
      if (form.source) params.set('utm_source', form.source);
      if (form.medium) params.set('utm_medium', form.medium);
      if (form.campaignName) params.set('utm_campaign', form.campaignName);
      if (form.campaignId) params.set('utm_id', form.campaignId);
      if (form.term) params.set('utm_term', form.term);
      if (form.content) params.set('utm_content', form.content);

      setFullUrl(`${form.websiteUrl}?${params.toString()}`);
    } else {
      setFullUrl('');
    }
  }, [form]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShortUrl('');

    try {
      const res = await axios.post('https://0din.link/shorten', { full: fullUrl });
      setShortUrl(`https://0din.link/${res.data.short}`);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }

    setLoading(false);
  };

  return (
    <div className="bitly-main">
      <h1 className="headline">Build stronger digital connections</h1>
      <p className="description">
        Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information.
      </p>

      <div className="shortener-form-box">
        <form className="short-form" onSubmit={handleSubmit}>
          <div>
            <label>Website URL *</label>
            <input name="websiteUrl" value={form.websiteUrl} onChange={handleInputChange} required placeholder="https://www.example.com" />
          </div>
          <div>
            <label>Campaign ID</label>
            <input name="campaignId" value={form.campaignId} onChange={handleInputChange} placeholder="12345" />
          </div>
          <div>
            <label>Campaign Source *</label>
            <input name="source" value={form.source} onChange={handleInputChange} required placeholder="google, newsletter..." />
          </div>
          <div>
            <label>Campaign Medium *</label>
            <input name="medium" value={form.medium} onChange={handleInputChange} required placeholder="cpc, banner, email..." />
          </div>
          <div>
            <label>Campaign Name *</label>
            <input name="campaignName" value={form.campaignName} onChange={handleInputChange} required placeholder="Promo name" />
          </div>
          <div>
            <label>Campaign Term</label>
            <input name="term" value={form.term} onChange={handleInputChange} placeholder="Paid keyword" />
          </div>
          <div>
            <label>Campaign Content</label>
            <input name="content" value={form.content} onChange={handleInputChange} placeholder="Ad content info" />
          </div>

          <div>
            <label>Generated Full URL</label>
            <div className="full-url-box">
              <textarea readOnly rows="3" value={fullUrl} placeholder="Full campaign URL will appear here" />
              <button
                type="button"
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(fullUrl);
                  setCopiedFull(true);
                  setTimeout(() => setCopiedFull(false), 2000);
                }}
              >
                <MdContentCopy className="copy-icon" />
                {copiedFull ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button type="submit" className="shorten-btn">
            {loading ? 'Shortening...' : 'Get your link for free'}
          </button>
        </form>

        {shortUrl && (
          <div className="short-result">
            <small>Short URL:</small>
            <div className="short-url-box">
              <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  setCopiedShort(true);
                  setTimeout(() => setCopiedShort(false), 2000);
                }}
                className="copy-btn"
              >
                <MdContentCopy className="copy-icon" />
                {copiedShort ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
