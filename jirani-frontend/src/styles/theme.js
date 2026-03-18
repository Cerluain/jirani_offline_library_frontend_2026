export const theme = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;900&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    /* Colors */
    --black:      #0A0A0A;
    --black-card: #111111;
    --border:     #2a2a2a;
    --gold:       #C9A84C;
    --gold-light: #E2C97E;
    --gold-dim:   #7a5e20;
    --text:       #F0EAD6;
    --text-muted: #7a7265;
    --text-dim:   #4a4540;
    --danger:     #c0392b;
    --danger-dim: #2a1210;
    --success:        #0d1a0d;
    --success-text:   #7ec87e;
    --success-border: #1e4020;

    /* Typography */
    --font-display: 'Playfair Display', serif;
    --font-body:    'IBM Plex Sans', sans-serif;
    --font-mono:    'IBM Plex Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── PAGE LAYOUT ── */
  .page {
    min-height: 100vh;
    background: var(--black);
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 39px,
      rgba(201,168,76,0.03) 39px, rgba(201,168,76,0.03) 40px
    );
    padding: 2.5rem 1.25rem 5rem;
    font-family: var(--font-body);
  }

  .container { max-width: 900px; margin: 0 auto; }

  /* ── HEADER ── */
  .page-header {
    margin-bottom: 3rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .page-header::after {
    content: ''; position: absolute;
    bottom: -1px; left: 0;
    width: 80px; height: 1px;
    background: var(--gold);
  }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 0.65rem; letter-spacing: 0.2em;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 0.6rem;
  }
  .page-header h1 {
    font-family: var(--font-display);
    font-weight: 700; font-size: 2.4rem;
    color: var(--text); line-height: 1.1;
  }
  .page-header h1 em { font-style: italic; color: var(--gold-light); }
  .page-header p { margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 300; }

  /* ── CARD ── */
  .card {
    background: var(--black-card);
    border: 1px solid var(--border);
    border-top: 2px solid var(--gold);
    border-radius: 4px;
    padding: 2rem;
    position: relative;
  }
  .card-label {
    position: absolute; top: -10px; left: 24px;
    background: var(--black-card); padding: 0 8px;
    font-family: var(--font-mono);
    font-size: 0.6rem; letter-spacing: 0.18em;
    color: var(--gold); text-transform: uppercase;
  }

  /* ── FORM ── */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; margin-bottom: 1.1rem; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-group.full { grid-column: 1 / -1; }

  .label {
    font-family: var(--font-mono);
    font-size: 0.62rem; letter-spacing: 0.15em;
    color: var(--text-muted); text-transform: uppercase;
  }

  .input, .textarea {
    background: var(--black); border: 1px solid var(--border);
    border-radius: 3px; padding: 10px 13px;
    font-family: var(--font-body);
    font-size: 0.9rem; color: var(--text);
    outline: none; transition: border-color 0.15s;
    resize: none;
  }
  .input::placeholder, .textarea::placeholder { color: var(--text-dim); }
  .input:focus, .textarea:focus { border-color: var(--gold-dim); }

  /* ── BUTTON ── */
  .btn-primary {
    padding: 13px; width: 100%;
    background: var(--gold); color: var(--black);
    border: none; border-radius: 3px;
    font-family: var(--font-mono);
    font-weight: 500; font-size: 0.8rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; transition: background 0.15s, opacity 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .btn-primary:hover:not(:disabled) { background: var(--gold-light); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-danger {
    background: none;
    border: 1px solid var(--border); border-radius: 3px;
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-dim);
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .btn-danger:hover { background: var(--danger-dim); border-color: var(--danger); color: #e07070; }
  .btn-danger:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── ALERT ── */
  .alert { margin-top: 1rem; padding: 10px 13px; border-radius: 3px; font-size: 0.83rem; font-family: var(--font-mono); }
  .alert.success { background: var(--success); color: var(--success-text); border: 1px solid var(--success-border); }
  .alert.error   { background: var(--danger-dim); color: #e07070; border: 1px solid #4a1a18; }

  /* ── SECTION HEADER ── */
  .section-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 1.25rem; }
  .section-header h2 { font-family: var(--font-display); font-weight: 600; font-size: 1.4rem; color: var(--text); }
  .section-count { font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold); }

  .divider { height: 1px; background: var(--border); margin-bottom: 1.5rem; position: relative; }
  .divider::before { content: ''; position: absolute; left: 0; top: 0; width: 40px; height: 1px; background: var(--gold); }

  /* ── SPINNER ── */
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: var(--black);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border); border-radius: 4px; }
  .empty-state p { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-dim); }

  /* ── FADE IN ── */
  .fadein { animation: fadein 0.35s ease both; }
  @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 600px) {
    .form-row { grid-template-columns: 1fr; }
    .page-header h1 { font-size: 1.8rem; }
    .card { padding: 1.4rem; }
  }
`;