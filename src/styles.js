export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --bg-primary: #0a0a0c;
    --bg-secondary: #111116;
    --bg-tertiary: #1a1a22;
    --bg-hover: #22222e;
    --border: #2a2a36;
    --border-light: #333344;
    --text-primary: #e8e8f0;
    --text-secondary: #8888a0;
    --text-muted: #555568;
    --accent: #6c5ce7;
    --accent-light: #a29bfe;
    --accent-dim: #6c5ce720;
    --success: #00b894;
    --success-dim: #00b89420;
    --danger: #e17055;
    --danger-dim: #e1705520;
    --warning: #f0932b;
    --warning-dim: #f0932b20;
    --radius: 8px;
    --radius-lg: 12px;
    --shadow: 0 2px 12px rgba(0,0,0,0.3);
    --font-body: 'Outfit', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --bottombar-h: 60px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  body, #root {
    font-family: var(--font-body);
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  /* ─── App Shell ─── */
  .app-layout { display: flex; height: 100vh; height: 100dvh; overflow: hidden; }

  /* ─── Desktop Sidebar ─── */
  .sidebar {
    width: 240px; background: var(--bg-secondary); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0;
  }
  .sidebar-header { padding: 18px 16px; border-bottom: 1px solid var(--border); }
  .sidebar-logo {
    font-family: var(--font-mono); font-size: 14px; font-weight: 700;
    color: var(--accent-light); display: flex; align-items: center; gap: 8px;
  }
  .dot {
    width: 8px; height: 8px; background: var(--accent); border-radius: 50%;
    animation: pulse 2s infinite; display: inline-block; flex-shrink: 0;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .sidebar-nav { padding: 10px 8px; flex: 1; overflow-y: auto; }
  .nav-section { margin-bottom: 6px; }
  .nav-section-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--text-muted); padding: 8px 10px 4px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 9px; padding: 9px 10px;
    border-radius: var(--radius); color: var(--text-secondary); cursor: pointer;
    font-size: 13px; font-weight: 500; transition: all 0.15s;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
  .nav-item.active { background: var(--accent-dim); color: var(--accent-light); }
  .nav-item .count {
    margin-left: auto; font-size: 11px; font-family: var(--font-mono);
    background: var(--bg-tertiary); padding: 2px 7px; border-radius: 10px; color: var(--text-muted);
  }

  /* ─── Main Area ─── */
  .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  .topbar {
    padding: 14px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg-secondary); position: sticky; top: 0; z-index: 50; min-height: 52px;
  }
  .topbar-title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }

  .content-area { padding: 20px 24px; flex: 1; max-width: 960px; width: 100%; margin: 0 auto; }

  /* ─── Bottom Tab Bar (mobile only) ─── */
  .bottom-bar {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--bg-secondary); border-top: 1px solid var(--border);
    z-index: 100; padding-bottom: var(--safe-bottom);
  }
  .bottom-bar-inner { display: flex; height: var(--bottombar-h); }
  .tab-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 2px; background: none; border: none;
    color: var(--text-muted); font-size: 10px; font-weight: 600;
    font-family: var(--font-body); cursor: pointer; position: relative;
    letter-spacing: 0.3px; transition: color 0.15s; padding: 0;
  }
  .tab-btn.active { color: var(--accent-light); }
  .tab-btn .tab-icon { position: relative; }
  .tab-badge {
    position: absolute; top: -5px; right: -10px;
    font-size: 9px; font-family: var(--font-mono);
    background: var(--accent); color: white;
    min-width: 16px; height: 16px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; padding: 0 4px;
  }

  /* ─── Buttons ─── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: var(--radius); font-size: 13px; font-weight: 500;
    font-family: var(--font-body); cursor: pointer; transition: all 0.15s;
    border: 1px solid transparent; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
  .btn-primary:hover { background: #5a4bd6; }
  .btn-ghost { background: transparent; color: var(--text-secondary); border-color: var(--border); }
  .btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
  .btn-danger { background: transparent; color: var(--danger); border-color: var(--danger); }
  .btn-danger:hover { background: var(--danger-dim); }
  .btn-success { background: var(--success); color: white; }
  .btn-success:hover { opacity: 0.9; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-icon {
    padding: 8px; border: none; background: none; color: var(--text-muted);
    cursor: pointer; border-radius: var(--radius);
  }
  .btn-icon:hover { background: var(--bg-hover); color: var(--text-primary); }

  /* ─── Cards ─── */
  .card {
    background: var(--bg-secondary); border: 1px solid var(--border);
    border-radius: var(--radius-lg); overflow: hidden; transition: border-color 0.15s;
  }
  .card:hover { border-color: var(--border-light); }
  .card-clickable { cursor: pointer; }
  .card-clickable:active { background: var(--bg-hover); }
  .card-header {
    padding: 14px 16px; display: flex; align-items: center;
    justify-content: space-between; border-bottom: 1px solid var(--border);
  }
  .card-body { padding: 14px 16px; }

  /* ─── Forms ─── */
  .input, .textarea, .select {
    width: 100%; padding: 10px 12px; background: var(--bg-tertiary);
    border: 1px solid var(--border); border-radius: var(--radius);
    color: var(--text-primary); font-family: var(--font-body); font-size: 16px;
    transition: border-color 0.15s; outline: none;
  }
  .input:focus, .textarea:focus, .select:focus { border-color: var(--accent); }
  .input::placeholder, .textarea::placeholder { color: var(--text-muted); }
  .textarea { resize: vertical; min-height: 70px; }
  .select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238888a0'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer;
  }
  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary);
    margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ─── Task Items (mobile-optimized) ─── */
  .task-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 10px; border-radius: var(--radius);
    transition: background 0.1s; min-height: 48px;
  }
  .task-item:active { background: var(--bg-hover); }

  .task-checkbox {
    width: 26px; height: 26px; min-width: 26px;
    border: 2px solid var(--border-light); border-radius: 6px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s; background: transparent; padding: 0;
    margin-top: 1px;
  }
  .task-checkbox.checked { background: var(--success); border-color: var(--success); }

  .task-content { flex: 1; min-width: 0; }
  .task-title { font-size: 14px; color: var(--text-primary); line-height: 1.4; word-break: break-word; }
  .task-title.done { text-decoration: line-through; color: var(--text-muted); }
  .task-meta { display: flex; align-items: center; gap: 8px; margin-top: 5px; flex-wrap: wrap; }

  /* ─── Checklist ─── */
  .checklist { margin-bottom: 16px; }
  .checklist-header {
    display: flex; align-items: center; justify-content: space-between; padding: 8px 0; margin-bottom: 2px;
  }
  .checklist-name {
    font-size: 14px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;
  }
  .checklist-progress {
    font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
    background: var(--bg-tertiary); padding: 3px 8px; border-radius: 10px;
  }

  /* ─── Progress Bar ─── */
  .progress-wrap { height: 5px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--success); border-radius: 3px; transition: width 0.4s ease; }

  /* ─── Status Badge ─── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px; font-size: 11px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    padding: 4px 10px; border-radius: 10px;
  }
  .badge.active { background: var(--accent-dim); color: var(--accent-light); }
  .badge.done { background: var(--success-dim); color: var(--success); }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* ─── Empty State ─── */
  .empty { text-align: center; padding: 48px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.4; }
  .empty-text { font-size: 14px; margin-bottom: 16px; }

  /* ─── Grid ─── */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }

  /* ─── Modal / Sheet ─── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg);
    width: 100%; max-width: 540px; max-height: 85vh; overflow-y: auto; box-shadow: var(--shadow);
  }
  .modal-header {
    padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex;
    align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: var(--bg-secondary); z-index: 1;
  }
  .modal-header h3 { font-size: 16px; font-weight: 600; }
  .modal-body { padding: 16px 20px; }
  .modal-footer {
    padding: 14px 20px; border-top: 1px solid var(--border); display: flex;
    justify-content: flex-end; gap: 8px;
    position: sticky; bottom: 0; background: var(--bg-secondary); z-index: 1;
  }

  /* ─── Tags ─── */
  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
    border-radius: 10px; font-size: 13px; font-weight: 500;
    background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border);
    min-height: 36px;
  }
  .tag .remove-tag {
    cursor: pointer; opacity: 0.5; transition: opacity 0.15s;
    background: none; border: none; color: inherit; padding: 2px; display: flex;
  }
  .tag .remove-tag:hover { opacity: 1; }

  .inline-add { display: flex; gap: 8px; align-items: center; padding: 4px 0; }
  .inline-add .input { flex: 1; }

  /* ─── FAB ─── */
  .fab {
    display: none; position: fixed; z-index: 90;
    width: 54px; height: 54px; border-radius: 50%;
    background: var(--accent); color: white; border: none;
    box-shadow: 0 4px 16px rgba(108,92,231,0.4);
    align-items: center; justify-content: center; cursor: pointer;
    bottom: calc(var(--bottombar-h) + var(--safe-bottom) + 16px); right: 16px;
  }
  .fab:active { transform: scale(0.92); }

  /* ─── Automation ─── */
  .auto-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.5px; padding: 3px 8px; border-radius: 6px;
    background: var(--warning-dim); color: var(--warning);
  }
  .auto-result {
    margin-top: 6px; padding: 8px 10px; border-radius: var(--radius);
    font-size: 12px; font-family: var(--font-mono);
    border: 1px solid var(--border); background: var(--bg-tertiary);
    max-height: 150px; overflow-y: auto; word-break: break-all;
    white-space: pre-wrap; line-height: 1.4;
  }
  .auto-result.ok { border-color: var(--success); }
  .auto-result.fail { border-color: var(--danger); }
  .btn-execute {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: var(--radius); font-size: 12px;
    font-weight: 600; font-family: var(--font-body);
    background: var(--warning-dim); color: var(--warning); border: 1px solid #f0932b40;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-execute:hover { background: #f0932b30; }
  .btn-execute:disabled { opacity: 0.5; cursor: not-allowed; }
  .header-pair { display: flex; gap: 6px; margin-bottom: 6px; align-items: center; }
  .header-pair .input { flex: 1; }
  .method-badge {
    font-size: 10px; font-weight: 700; font-family: var(--font-mono);
    padding: 2px 6px; border-radius: 4px; background: var(--bg-tertiary);
    color: var(--text-secondary); letter-spacing: 0.5px;
  }
  .task-row-tpl {
    display: flex; align-items: center; gap: 8px; padding: 7px 0; min-height: 42px;
    cursor: pointer; border-radius: var(--radius); transition: background 0.1s;
  }
  .task-row-tpl:hover { background: var(--bg-hover); }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinning { animation: spin 1s linear infinite; }

  /* ─── Animations ─── */
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .fade-in { animation: fadeIn 0.2s ease; }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }

  /* === MOBILE === */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .bottom-bar { display: block; }
    .fab { display: flex; }
    .topbar { padding: 10px 14px; min-height: 46px; }
    .topbar-title { font-size: 15px; }
    .topbar .desktop-only { display: none; }
    .content-area { padding: 10px 10px calc(var(--bottombar-h) + var(--safe-bottom) + 10px) 10px; }
    .card-grid { grid-template-columns: 1fr; gap: 10px; }
    .card-body { padding: 12px 14px; }
    .modal-overlay { padding: 0; align-items: flex-end; }
    .modal {
      max-width: 100%; max-height: 92dvh;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0; border-bottom: none;
      animation: slideUp 0.25s ease;
    }
    .modal-body { padding: 16px 16px; }
    .task-item { padding: 11px 6px; gap: 10px; }
    .btn { padding: 10px 18px; font-size: 14px; }
    .btn-sm { padding: 8px 14px; font-size: 13px; }
  }

  @media (max-width: 380px) {
    .content-area { padding: 6px 6px calc(var(--bottombar-h) + var(--safe-bottom) + 6px) 6px; }
  }
`;
