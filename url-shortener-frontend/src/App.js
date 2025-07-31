import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdContentCopy } from 'react-icons/md';
import './App.css';

// ✅ Toast component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      {message}
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    websiteUrl: '',
    campaignId: '',
    source: '',
    utmSource: '',
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
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (form.websiteUrl) {
      const params = new URLSearchParams();

      // ✅ Add all fields only if not empty
      if (form.source) params.set('utm_source', form.source);
      if (form.utmSource.trim()) params.set('utm_custom_source', form.utmSource.trim());
      if (form.medium) params.set('utm_medium', form.medium);
      if (form.campaignName) params.set('utm_campaign', form.campaignName);
      if (form.campaignId) params.set('utm_id', form.campaignId);
      if (form.term) params.set('utm_term', form.term);
      if (form.content) params.set('utm_content', form.content);

      const separator = form.websiteUrl.includes('?') ? '&' : '?';
      setFullUrl(`${form.websiteUrl}${separator}${params.toString()}`);
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
      const res = await axios.post('https://www.0din.link/shorten', { full: fullUrl });
      setShortUrl(`https://www.0din.link/${res.data.short}`);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setToastMsg('Failed to shorten URL. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="bitly-main">
      <h1 className="headline">Build stronger digital connections</h1>
      <p className="description">
        Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information.
      </p>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <div className="shortener-form-box">
        <form className="short-form" onSubmit={handleSubmit}>
          <div>
            <label>Website URL</label>
            <input name="websiteUrl" value={form.websiteUrl} onChange={handleInputChange}  placeholder="https://www.example.com" />
          </div>

          <div>
            <label>Campaign ID</label>
            <input name="campaignId" value={form.campaignId} onChange={handleInputChange} placeholder="12345" />
          </div>

            <div>
            <label>Source (Original Traffic Source)</label>
            <input name="source" value={form.source} onChange={handleInputChange} placeholder="youtube, instgram, facebook" />
          </div>

          <div>
            <label>Campaign Medium (Original Traffic Source Drill Down 1)</label>
            <select
              name="medium"
              value={form.medium}
              onChange={handleInputChange}
              
            >
              <option value="" disabled>Select a source</option>
              <option value="Email Marketing">Email Marketing</option>
              <option value="Paid Search">Paid Search</option>
              <option value="Organic Social">Organic Social</option>
              <option value="Paid Social">Paid Social</option>
              <option value="Other Campaigns">Other Campaigns</option>
            </select>
          </div>

          {/* <div>
            <label>Campaign Medium </label>
            <input name="medium" value={form.medium} onChange={handleInputChange}  placeholder="cpc, banner, email..." />
          </div> */}

          <div>
            <label>Campaign Name (Original Traffic Source Drill Down 2)</label>
            <input name="campaignName" value={form.campaignName} onChange={handleInputChange}  placeholder="Promo name" />
          </div>

          <div>
            <label>Campaign Term (UTM Term-First Page Seen)</label>
            <input name="term" value={form.term} onChange={handleInputChange} placeholder="Paid keyword" />
          </div>

          <div>
            <label>Campaign Content (UTM Content-First Page Seen)</label>
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
