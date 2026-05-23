import { useState } from "react";

export default function Login({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const PASSWORD = import.meta.env.VITE_APP_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw.trim() === PASSWORD) {
        localStorage.setItem("ev_authenticated", "true");
        onSuccess();
      } else {
        setErr("Incorrect password. Try again.");
        setPw("");
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="login-screen">
      <div className="login-logo">
        🎂
        <br />
        <em>Happy Birthday, Dad</em>
      </div>
      <p className="login-sub">We&apos;ve prepared something special for you</p>

      <form className="login-box" onSubmit={handleSubmit}>
        <label htmlFor="pw-input">Access password</label>
        <input
          id="pw-input"
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr("");
          }}
          autoFocus
          autoComplete="current-password"
        />
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Checking…" : "Open Guide →"}
        </button>
        <p className="login-err" role="alert">
          {err}
        </p>
      </form>

      <p className="login-hint">From Ankit, with love · 18 May 2026</p>
    </div>
  );
}
