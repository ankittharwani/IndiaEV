import { useState } from 'react';

export default function Login({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const PASSWORD = import.meta.env.VITE_APP_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw.trim() === PASSWORD) {
        onSuccess();
      } else {
        setErr('Incorrect password. Try again.');
        setPw('');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="login-screen">
      <div className="login-logo">
        Dad&apos;s<br /><em>Car Guide</em>
      </div>
      <p className="login-sub">A family research project · May 2026</p>

      <form className="login-box" onSubmit={handleSubmit}>
        <label htmlFor="pw-input">Access password</label>
        <input
          id="pw-input"
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(''); }}
          autoFocus
          autoComplete="current-password"
        />
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Checking…' : 'Open Guide →'}
        </button>
        <p className="login-err" role="alert">{err}</p>
      </form>

      <p className="login-hint">Shared by Ankit · for family use only</p>
    </div>
  );
}
