import { useState, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [{ email: "demo@bank.com", password: "demo123", name: "Alex Johnson" }];

const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Bills & Utilities", "Entertainment", "Healthcare", "Income", "Transfer", "Other"];

const KEYWORDS = {
  "Food & Dining": ["uber eats", "doordash", "restaurant", "cafe", "coffee", "food", "pizza", "burger", "grocery", "whole foods", "trader joe"],
  "Transport": ["uber", "lyft", "taxi", "gas", "fuel", "parking", "toll", "transit", "metro", "bus"],
  "Shopping": ["amazon", "walmart", "target", "ebay", "shop", "store", "mall", "clothing", "shoes"],
  "Bills & Utilities": ["electric", "water", "internet", "phone", "insurance", "rent", "mortgage", "utility", "netflix", "spotify"],
  "Entertainment": ["movie", "cinema", "theatre", "concert", "game", "steam", "playstation", "xbox"],
  "Healthcare": ["pharmacy", "hospital", "doctor", "medical", "health", "dental", "vision"],
  "Income": ["salary", "payroll", "deposit", "freelance", "payment received", "transfer in"],
};

function autoCategory(desc) {
  const lower = desc.toLowerCase();
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    if (kws.some(k => lower.includes(k))) return cat;
  }
  return "Other";
}

const INITIAL_ACCOUNTS = [
  { id: 1, name: "Chase Checking", type: "Checking", balance: 4250.75, color: "#3b82f6" },
  { id: 2, name: "Savings Account", type: "Savings", balance: 12800.00, color: "#10b981" },
  { id: 3, name: "Visa Credit Card", type: "Credit", balance: -1340.50, color: "#f59e0b" },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, accountId: 1, desc: "Whole Foods Market", amount: -87.43, date: "2025-02-18", category: "Food & Dining" },
  { id: 2, accountId: 1, desc: "Salary Deposit", amount: 3200.00, date: "2025-02-15", category: "Income" },
  { id: 3, accountId: 3, desc: "Netflix Subscription", amount: -15.99, date: "2025-02-14", category: "Bills & Utilities" },
  { id: 4, accountId: 1, desc: "Uber Ride", amount: -23.50, date: "2025-02-13", category: "Transport" },
  { id: 5, accountId: 3, desc: "Amazon Purchase", amount: -142.00, date: "2025-02-12", category: "Shopping" },
  { id: 6, accountId: 1, desc: "Coffee Shop", amount: -6.75, date: "2025-02-11", category: "Food & Dining" },
  { id: 7, accountId: 2, desc: "Interest Payment", amount: 12.40, date: "2025-02-10", category: "Income" },
  { id: 8, accountId: 1, desc: "Electric Bill", amount: -94.00, date: "2025-02-09", category: "Bills & Utilities" },
];

const INITIAL_BUDGETS = [
  { id: 1, category: "Food & Dining", limit: 400, period: "Monthly" },
  { id: 2, category: "Transport", limit: 150, period: "Monthly" },
  { id: 3, category: "Shopping", limit: 300, period: "Monthly" },
];

const INITIAL_BILLS = [
  { id: 1, name: "Netflix", amount: 15.99, dueDate: "2025-03-01", status: "Upcoming" },
  { id: 2, name: "Spotify", amount: 9.99, dueDate: "2025-02-15", status: "Paid" },
  { id: 3, name: "Electric Bill", amount: 94.00, dueDate: "2025-02-10", status: "Overdue" },
  { id: 4, name: "Internet", amount: 59.99, dueDate: "2025-03-05", status: "Upcoming" },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface2: #1a2236;
    --border: #1f2d47;
    --accent: #3b82f6;
    --accent2: #10b981;
    --danger: #ef4444;
    --warn: #f59e0b;
    --text: #f1f5f9;
    --text2: #94a3b8;
    --text3: #4b5563;
    --font-serif: 'Instrument Serif', Georgia, serif;
    --font-sans: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 14px; }

  .app-wrap { display: flex; min-height: 100vh; }

  /* Auth pages */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 20% 50%, rgba(59,130,246,.15) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(16,185,129,.1) 0%, transparent 60%), var(--bg);
  }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 48px 40px; width: 420px; position: relative; overflow: hidden;
    box-shadow: 0 25px 60px rgba(0,0,0,.5);
  }
  .auth-card::before {
    content: ''; position: absolute; inset: 0; border-radius: 20px;
    background: linear-gradient(135deg, rgba(59,130,246,.08) 0%, transparent 50%);
    pointer-events: none;
  }
  .auth-logo { font-family: var(--font-serif); font-size: 28px; color: var(--accent); margin-bottom: 8px; }
  .auth-sub { color: var(--text2); margin-bottom: 36px; font-size: 14px; }
  .auth-title { font-family: var(--font-serif); font-size: 22px; margin-bottom: 4px; }

  .form-group { margin-bottom: 18px; }
  .form-group label { display: block; margin-bottom: 6px; color: var(--text2); font-size: 13px; font-weight: 500; }
  .form-group input, .form-group select {
    width: 100%; padding: 10px 14px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 10px; color: var(--text);
    font-family: var(--font-sans); font-size: 14px; outline: none; transition: border-color .2s;
  }
  .form-group input:focus, .form-group select:focus { border-color: var(--accent); }
  .form-group select option { background: var(--surface2); }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px; font-family: var(--font-sans);
    font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all .2s;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #2563eb; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-full { width: 100%; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }

  .auth-link { margin-top: 20px; text-align: center; color: var(--text2); font-size: 13px; }
  .auth-link span { color: var(--accent); cursor: pointer; text-decoration: underline; }
  .error-msg { color: var(--danger); font-size: 13px; margin-bottom: 14px; padding: 8px 12px; background: rgba(239,68,68,.1); border-radius: 8px; border: 1px solid rgba(239,68,68,.2); }
  .success-msg { color: var(--accent2); font-size: 13px; margin-bottom: 14px; padding: 8px 12px; background: rgba(16,185,129,.1); border-radius: 8px; border: 1px solid rgba(16,185,129,.2); }

  /* Sidebar */
  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0;
    position: sticky; top: 0; height: 100vh;
  }
  .sidebar-logo { font-family: var(--font-serif); font-size: 22px; color: var(--accent); padding: 0 8px; margin-bottom: 32px; }
  .sidebar-logo span { color: var(--text2); font-size: 12px; font-family: var(--font-sans); display: block; margin-top: 2px; }
  .nav-section { margin-bottom: 8px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .1em; padding: 0 8px; margin-bottom: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px;
    cursor: pointer; color: var(--text2); font-size: 13px; font-weight: 500; transition: all .15s;
    margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(59,130,246,.15); color: var(--accent); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; }
  .user-chip {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--surface2); border-radius: 10px; border: 1px solid var(--border);
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #fff; flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 500; }
  .user-email { font-size: 11px; color: var(--text2); }
  .logout-btn { margin-top: 8px; width: 100%; padding: 8px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text2); cursor: pointer; font-family: var(--font-sans); font-size: 13px; transition: all .2s; }
  .logout-btn:hover { border-color: var(--danger); color: var(--danger); }

  /* Main */
  .main { flex: 1; overflow-y: auto; }
  .page { padding: 32px; max-width: 1100px; }
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: var(--font-serif); font-size: 30px; margin-bottom: 4px; }
  .page-sub { color: var(--text2); font-size: 14px; }

  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px;
    margin-bottom: 16px;
  }
  .card-title { font-size: 13px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 12px; }

  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

  /* Stat cards */
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px;
    position: relative; overflow: hidden;
  }
  .stat-card::after {
    content: ''; position: absolute; top: -20px; right: -20px; width: 80px; height: 80px;
    border-radius: 50%; opacity: .08;
  }
  .stat-card.blue::after { background: var(--accent); }
  .stat-card.green::after { background: var(--accent2); }
  .stat-card.amber::after { background: var(--warn); }
  .stat-card.red::after { background: var(--danger); }
  .stat-label { font-size: 12px; color: var(--text2); margin-bottom: 8px; font-weight: 500; }
  .stat-value { font-family: var(--font-serif); font-size: 28px; margin-bottom: 4px; }
  .stat-badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; display: inline-block; }
  .badge-green { background: rgba(16,185,129,.15); color: var(--accent2); }
  .badge-red { background: rgba(239,68,68,.15); color: var(--danger); }
  .badge-blue { background: rgba(59,130,246,.15); color: var(--accent); }
  .badge-amber { background: rgba(245,158,11,.15); color: var(--warn); }

  /* Account card */
  .account-card {
    border-radius: 14px; padding: 20px; position: relative; overflow: hidden;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 12px;
  }
  .account-dot { width: 10px; height: 10px; border-radius: 50%; }
  .account-name-row { display: flex; align-items: center; gap: 8px; }
  .account-name { font-weight: 600; font-size: 14px; }
  .account-type { font-size: 11px; color: var(--text2); background: var(--surface); padding: 2px 8px; border-radius: 20px; }
  .account-balance { font-family: var(--font-serif); font-size: 26px; }

  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .05em; padding: 8px 12px; border-bottom: 1px solid var(--border); }
  td { padding: 12px; border-bottom: 1px solid rgba(31,45,71,.5); font-size: 13px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,.02); }

  .amount-pos { color: var(--accent2); font-weight: 500; }
  .amount-neg { color: var(--text); }
  .cat-badge { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; background: var(--surface2); color: var(--text2); }

  /* Progress bar */
  .progress-bar { height: 6px; background: var(--surface2); border-radius: 4px; overflow: hidden; margin: 8px 0; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }

  /* Bill status */
  .status-paid { color: var(--accent2); background: rgba(16,185,129,.1); padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .status-upcoming { color: var(--accent); background: rgba(59,130,246,.1); padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .status-overdue { color: var(--danger); background: rgba(239,68,68,.1); padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex;
    align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 32px; width: 440px; max-width: 100%;
    box-shadow: 0 25px 60px rgba(0,0,0,.5);
  }
  .modal-title { font-family: var(--font-serif); font-size: 22px; margin-bottom: 24px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }

  /* Insights */
  .insight-card { border-left: 3px solid var(--accent); padding: 16px 20px; background: var(--surface2); border-radius: 0 12px 12px 0; margin-bottom: 12px; }
  .insight-title { font-weight: 600; margin-bottom: 4px; }
  .insight-desc { color: var(--text2); font-size: 13px; }

  /* Alert */
  .alert-card { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; background: var(--surface2); border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border); }
  .alert-icon { font-size: 20px; }

  /* Reward */
  .reward-big { font-family: var(--font-serif); font-size: 48px; color: var(--warn); }
  .reward-sub { color: var(--text2); }

  /* Mini donut / bar chart purely CSS */
  .chart-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .chart-label { width: 130px; font-size: 12px; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chart-bar-inner { flex: 1; height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .chart-fill { height: 100%; border-radius: 4px; }
  .chart-amt { font-size: 12px; color: var(--text2); width: 60px; text-align: right; }

  /* CSV note */
  .csv-note { font-size: 11px; color: var(--text3); margin-top: 6px; }

  /* Responsive */
  @media (max-width: 768px) {
    .grid-3 { grid-template-columns: 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
    .sidebar { display: none; }
  }
`;

// ─── Components ───────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, actions }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}

function AddAccountModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", type: "Checking", balance: "" });
  const colors = { Checking: "#3b82f6", Savings: "#10b981", Credit: "#f59e0b", Investment: "#8b5cf6" };
  return (
    <Modal title="Add Account" onClose={onClose} actions={[
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>,
      <button className="btn btn-primary" onClick={() => {
        if (!form.name || form.balance === "") return;
        onAdd({ id: Date.now(), ...form, balance: parseFloat(form.balance), color: colors[form.type] || "#3b82f6" });
        onClose();
      }}>Add Account</button>
    ]}>
      <div className="form-group"><label>Account Name</label><input placeholder="e.g. Chase Checking" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-group"><label>Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        {["Checking", "Savings", "Credit", "Investment"].map(t => <option key={t}>{t}</option>)}
      </select></div>
      <div className="form-group"><label>Current Balance ($)</label><input type="number" placeholder="0.00" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} /></div>
    </Modal>
  );
}

function AddTransactionModal({ accounts, onClose, onAdd }) {
  const [form, setForm] = useState({ accountId: accounts[0]?.id || 1, desc: "", amount: "", date: new Date().toISOString().split("T")[0], type: "expense" });
  return (
    <Modal title="Add Transaction" onClose={onClose} actions={[
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>,
      <button className="btn btn-primary" onClick={() => {
        if (!form.desc || !form.amount) return;
        const amt = Math.abs(parseFloat(form.amount)) * (form.type === "expense" ? -1 : 1);
        onAdd({ id: Date.now(), accountId: parseInt(form.accountId), desc: form.desc, amount: amt, date: form.date, category: autoCategory(form.desc) });
        onClose();
      }}>Add</button>
    ]}>
      <div className="form-group"><label>Account</label><select value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })}>
        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select></div>
      <div className="form-group"><label>Description</label><input placeholder="e.g. Whole Foods" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></div>
      <div className="form-group"><label>Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="expense">Expense</option><option value="income">Income</option>
      </select></div>
      <div className="form-group"><label>Amount ($)</label><input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
      <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
    </Modal>
  );
}

function AddBudgetModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ category: CATEGORIES[0], limit: "", period: "Monthly" });
  return (
    <Modal title="Set Budget" onClose={onClose} actions={[
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>,
      <button className="btn btn-primary" onClick={() => { if (!form.limit) return; onAdd({ id: Date.now(), ...form, limit: parseFloat(form.limit) }); onClose(); }}>Save</button>
    ]}>
      <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select></div>
      <div className="form-group"><label>Monthly Limit ($)</label><input type="number" placeholder="0.00" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} /></div>
    </Modal>
  );
}

function AddBillModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "", status: "Upcoming" });
  return (
    <Modal title="Add Bill" onClose={onClose} actions={[
      <button className="btn btn-secondary" onClick={onClose}>Cancel</button>,
      <button className="btn btn-primary" onClick={() => { if (!form.name || !form.amount || !form.dueDate) return; onAdd({ id: Date.now(), ...form, amount: parseFloat(form.amount) }); onClose(); }}>Add Bill</button>
    ]}>
      <div className="form-group"><label>Bill Name</label><input placeholder="e.g. Electricity" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-group"><label>Amount ($)</label><input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
      <div className="form-group"><label>Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
      <div className="form-group"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
        {["Upcoming", "Paid", "Overdue"].map(s => <option key={s}>{s}</option>)}
      </select></div>
    </Modal>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function LoginPage({ users, setUsers, setUser, goRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const login = () => {
    const found = users.find(u => u.email === form.email && u.password === form.password);
    if (found) { setUser(found); }
    else setError("Invalid email or password.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">NexaBank</div>
        <div className="auth-sub">Modern banking dashboard</div>
        <div className="auth-title">Sign in to your account</div>
        <div style={{ height: 24 }} />
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label>Email</label><input type="email" placeholder="demo@bank.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} /></div>
        <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} /></div>
        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={login}>Sign In</button>
        <div className="auth-link">Don't have an account? <span onClick={goRegister}>Create one</span></div>
        <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(59,130,246,.08)", borderRadius: 8, border: "1px solid rgba(59,130,246,.2)" }}>
          <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4 }}>Demo credentials:</div>
          <div style={{ fontSize: 12, color: "var(--accent)", fontFamily: "monospace" }}>demo@bank.com / demo123</div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ users, setUsers, setUser, goLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const register = () => {
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (users.find(u => u.email === form.email)) { setError("Email already registered."); return; }
    const newUser = { name: form.name, email: form.email, password: form.password };
    setUsers(prev => [...prev, newUser]);
    setSuccess(true);
    setTimeout(() => setUser(newUser), 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">NexaBank</div>
        <div className="auth-sub">Modern banking dashboard</div>
        <div className="auth-title">Create your account</div>
        <div style={{ height: 24 }} />
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">Account created! Redirecting…</div>}
        <div className="form-group"><label>Full Name</label><input placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-group"><label>Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group"><label>Password</label><input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>
        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={register}>Create Account</button>
        <div className="auth-link">Already have an account? <span onClick={goLogin}>Sign in</span></div>
      </div>
    </div>
  );
}

// Dashboard overview
function DashboardPage({ accounts, transactions, budgets, bills }) {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthTxns = transactions.filter(t => t.date >= "2025-02-01");
  const income = monthTxns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = monthTxns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const overdueBills = bills.filter(b => b.status === "Overdue").length;
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // Category spending for chart
  const catSpend = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    catSpend[t.category] = (catSpend[t.category] || 0) + Math.abs(t.amount);
  });
  const maxSpend = Math.max(...Object.values(catSpend));

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Good morning 👋</div>
        <div className="page-sub">Here's your financial overview for February 2025</div>
      </div>

      <div className="grid-3">
        <div className="stat-card blue">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          <div className="stat-badge badge-blue">Across {accounts.length} accounts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Monthly Income</div>
          <div className="stat-value">${income.toFixed(2)}</div>
          <div className="stat-badge badge-green">↑ This month</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Monthly Expenses</div>
          <div className="stat-value">${expenses.toFixed(2)}</div>
          <div className="stat-badge badge-amber">{monthTxns.filter(t => t.amount < 0).length} transactions</div>
        </div>
      </div>

      {overdueBills > 0 && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div><strong>{overdueBills} overdue bill{overdueBills > 1 ? "s" : ""}</strong> — please review your Bills section.</div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Recent Transactions</div>
          <table>
            <thead><tr><th>Description</th><th>Date</th><th>Amount</th></tr></thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id}>
                  <td>{t.desc}</td>
                  <td style={{ color: "var(--text2)" }}>{t.date}</td>
                  <td className={t.amount > 0 ? "amount-pos" : "amount-neg"}>{t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Spending by Category</div>
          {Object.entries(catSpend).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([cat, amt]) => (
            <div className="chart-bar" key={cat}>
              <div className="chart-label">{cat}</div>
              <div className="chart-bar-inner"><div className="chart-fill" style={{ width: `${(amt / maxSpend) * 100}%`, background: "var(--accent)" }} /></div>
              <div className="chart-amt">${amt.toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Accounts page
function AccountsPage({ accounts, setAccounts, transactions }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="page-title">Accounts</div>
          <div className="page-sub">Manage your bank accounts</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Account</button>
      </div>

      <div className="grid-3">
        {accounts.map(a => (
          <div className="account-card" key={a.id}>
            <div className="account-name-row">
              <div className="account-dot" style={{ background: a.color }} />
              <div className="account-name">{a.name}</div>
              <div className="account-type">{a.type}</div>
            </div>
            <div className="account-balance" style={{ color: a.balance < 0 ? "var(--danger)" : "var(--text)" }}>
              {a.balance < 0 ? "-" : ""}${Math.abs(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {transactions.filter(t => t.accountId === a.id).length} transactions
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} onAdd={a => setAccounts(prev => [...prev, a])} />}
    </div>
  );
}

// Transactions page
function TransactionsPage({ accounts, transactions, setTransactions }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = filter === "all" ? sorted : sorted.filter(t => t.category === filter);
  const accountName = id => accounts.find(a => a.id === id)?.name || "Unknown";

  const handleCSV = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split("\n").slice(1);
      const parsed = lines.filter(l => l.trim()).map((l, i) => {
        const [date, desc, amount] = l.split(",").map(s => s.trim().replace(/"/g, ""));
        return { id: Date.now() + i, accountId: accounts[0]?.id || 1, date, desc, amount: parseFloat(amount), category: autoCategory(desc || "") };
      }).filter(t => !isNaN(t.amount));
      setTransactions(prev => [...prev, ...parsed]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-sub">All your spending and income</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
            📁 Import CSV
            <input type="file" accept=".csv" style={{ display: "none" }} onChange={handleCSV} />
          </label>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add</button>
        </div>
      </div>
      <div className="csv-note" style={{ marginBottom: 16 }}>CSV format: date,description,amount (e.g. 2025-02-10,Coffee,-6.75)</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...CATEGORIES.slice(0, 6)].map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(c)}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Description</th><th>Account</th><th>Category</th><th>Date</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.desc}</td>
                  <td style={{ color: "var(--text2)" }}>{accountName(t.accountId)}</td>
                  <td>
                    <select value={t.category} onChange={e => setTransactions(prev => prev.map(tx => tx.id === t.id ? { ...tx, category: e.target.value } : tx))}
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text2)", padding: "3px 6px", fontSize: 12 }}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{t.date}</td>
                  <td className={t.amount > 0 ? "amount-pos" : "amount-neg"}>{t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => setTransactions(prev => prev.filter(tx => tx.id !== t.id))}>✕</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text2)", padding: 32 }}>No transactions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddTransactionModal accounts={accounts} onClose={() => setShowAdd(false)} onAdd={t => setTransactions(prev => [...prev, t])} />}
    </div>
  );
}

// Budgets page
function BudgetsPage({ budgets, setBudgets, transactions }) {
  const [showAdd, setShowAdd] = useState(false);
  const getSpent = (cat) => transactions.filter(t => t.category === cat && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div className="page-title">Budgets</div><div className="page-sub">Control your spending by category</div></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Set Budget</button>
      </div>

      <div className="grid-2">
        {budgets.map(b => {
          const spent = getSpent(b.category);
          const pct = Math.min((spent / b.limit) * 100, 100);
          const over = spent > b.limit;
          return (
            <div className="card" key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.category}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{b.period}</div>
                </div>
                <button className="btn btn-sm btn-secondary" style={{ border: "none", color: "var(--text3)" }} onClick={() => setBudgets(prev => prev.filter(x => x.id !== b.id))}>✕</button>
              </div>
              <div className="progress-bar" style={{ marginTop: 16 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: over ? "var(--danger)" : pct > 75 ? "var(--warn)" : "var(--accent2)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span style={{ color: over ? "var(--danger)" : "var(--text2)" }}>${spent.toFixed(2)} spent</span>
                <span style={{ color: "var(--text2)" }}>${b.limit.toFixed(2)} limit</span>
              </div>
              {over && <div style={{ marginTop: 8, fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>⚠️ Budget exceeded by ${(spent - b.limit).toFixed(2)}</div>}
            </div>
          );
        })}
        {budgets.length === 0 && <div style={{ color: "var(--text2)" }}>No budgets set yet.</div>}
      </div>

      {showAdd && <AddBudgetModal onClose={() => setShowAdd(false)} onAdd={b => setBudgets(prev => [...prev, b])} />}
    </div>
  );
}

// Bills page
function BillsPage({ bills, setBills }) {
  const [showAdd, setShowAdd] = useState(false);
  const statusClass = s => s === "Paid" ? "status-paid" : s === "Overdue" ? "status-overdue" : "status-upcoming";
  const sorted = [...bills].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const totalDue = bills.filter(b => b.status !== "Paid").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div className="page-title">Bills</div><div className="page-sub">Track your recurring payments</div></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Bill</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card amber"><div className="stat-label">Total Due</div><div className="stat-value">${totalDue.toFixed(2)}</div></div>
        <div className="stat-card red"><div className="stat-label">Overdue</div><div className="stat-value">{bills.filter(b => b.status === "Overdue").length}</div></div>
        <div className="stat-card green"><div className="stat-label">Paid This Month</div><div className="stat-value">{bills.filter(b => b.status === "Paid").length}</div></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Bill</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {sorted.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.name}</td>
                  <td>${b.amount.toFixed(2)}</td>
                  <td style={{ color: b.status === "Overdue" ? "var(--danger)" : "var(--text2)" }}>{b.dueDate}</td>
                  <td><span className={statusClass(b.status)}>{b.status}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    {b.status !== "Paid" && <button className="btn btn-sm btn-secondary" onClick={() => setBills(prev => prev.map(x => x.id === b.id ? { ...x, status: "Paid" } : x))}>Mark Paid</button>}
                    <button className="btn btn-sm btn-danger" onClick={() => setBills(prev => prev.filter(x => x.id !== b.id))}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddBillModal onClose={() => setShowAdd(false)} onAdd={b => setBills(prev => [...prev, b])} />}
    </div>
  );
}

// Rewards page
function RewardsPage({ transactions }) {
  const totalSpend = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const points = Math.floor(totalSpend * 1.5);

  const currencies = [
    { code: "USD", rate: 1, flag: "🇺🇸" },
    { code: "EUR", rate: 0.92, flag: "🇪🇺" },
    { code: "GBP", rate: 0.79, flag: "🇬🇧" },
    { code: "JPY", rate: 149.5, flag: "🇯🇵" },
    { code: "CAD", rate: 1.36, flag: "🇨🇦" },
    { code: "AUD", rate: 1.53, flag: "🇦🇺" },
    { code: "INR", rate: 83.1, flag: "🇮🇳" },
  ];
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const convert = () => {
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    return ((parseFloat(amount) / fromRate) * toRate).toFixed(2);
  };

  return (
    <div className="page">
      <div className="page-header"><div className="page-title">Rewards & Currency</div><div className="page-sub">Your points and currency tools</div></div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Rewards Points</div>
          <div className="reward-big">{points.toLocaleString()}</div>
          <div className="reward-sub" style={{ marginTop: 8 }}>pts</div>
          <div style={{ marginTop: 16, color: "var(--text2)", fontSize: 13 }}>Earned 1.5 pts per $1 spent. Redeem for cashback, travel miles, or gift cards.</div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {["Cashback", "Travel Miles", "Gift Cards"].map(r => (
              <div key={r} style={{ flex: 1, padding: "10px 8px", background: "var(--surface2)", borderRadius: 10, textAlign: "center", fontSize: 12, border: "1px solid var(--border)" }}>
                {r === "Cashback" ? "💵" : r === "Travel Miles" ? "✈️" : "🎁"}<br />
                <span style={{ fontWeight: 600 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Currency Converter</div>
          <div className="form-group"><label>Amount</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label>From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 16, color: "var(--text2)" }}>→</div>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label>To</label>
              <select value={to} onChange={e => setTo(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
              </select>
            </div>
          </div>
          <div style={{ padding: "20px", background: "var(--surface2)", borderRadius: 12, textAlign: "center" }}>
            <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 8 }}>{amount} {from} =</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, color: "var(--accent)" }}>{convert()}</div>
            <div style={{ color: "var(--text2)", fontSize: 13 }}>{to}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Insights page
function InsightsPage({ transactions, budgets }) {
  const catSpend = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    catSpend[t.category] = (catSpend[t.category] || 0) + Math.abs(t.amount);
  });
  const topCat = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

  const exceededBudgets = budgets.filter(b => {
    const spent = transactions.filter(t => t.category === b.category && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return spent > b.limit;
  });

  const alerts = [
    ...(exceededBudgets.map(b => ({ icon: "⚠️", title: `Budget exceeded: ${b.category}`, desc: `You've gone over your ${b.category} budget this month.` }))),
    ...(savings < 0 ? [{ icon: "🔴", title: "Negative savings", desc: "Your expenses exceed your income this period. Review your spending." }] : []),
    { icon: "💡", title: "Savings rate", desc: `Your current savings rate is ${savingsRate}%.${parseFloat(savingsRate) > 20 ? " Great job!" : " Consider reducing discretionary spending."}` },
  ];

  const insights = [
    topCat ? { title: `Top spending: ${topCat[0]}`, desc: `You've spent $${topCat[1].toFixed(2)} on ${topCat[0]} — your largest category.` } : null,
    { title: "Monthly cashflow", desc: `Income $${income.toFixed(2)} – Expenses $${expenses.toFixed(2)} = ${savings >= 0 ? "+" : ""}$${savings.toFixed(2)} net.` },
    { title: "Transaction frequency", desc: `You've made ${transactions.length} transactions across your accounts.` },
  ].filter(Boolean);

  return (
    <div className="page">
      <div className="page-header"><div className="page-title">Insights & Alerts</div><div className="page-sub">AI-powered spending analysis</div></div>

      <div className="grid-2">
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>SPENDING INSIGHTS</div>
          {insights.map((ins, i) => <div className="insight-card" key={i}><div className="insight-title">{ins.title}</div><div className="insight-desc">{ins.desc}</div></div>)}
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>ALERTS</div>
          {alerts.map((a, i) => (
            <div className="alert-card" key={i}>
              <div className="alert-icon">{a.icon}</div>
              <div><div style={{ fontWeight: 600, marginBottom: 4 }}>{a.title}</div><div style={{ color: "var(--text2)", fontSize: 13 }}>{a.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬛" },
  { id: "accounts", label: "Accounts", icon: "🏦" },
  { id: "transactions", label: "Transactions", icon: "↔️" },
  { id: "budgets", label: "Budgets", icon: "📊" },
  { id: "bills", label: "Bills", icon: "📄" },
  { id: "rewards", label: "Rewards", icon: "⭐" },
  { id: "insights", label: "Insights", icon: "💡" },
];

export default function App() {
  const [auth, setAuth] = useState("login"); // login | register | app
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [page, setPage] = useState("dashboard");

  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [bills, setBills] = useState(INITIAL_BILLS);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleLogin = (u) => { setUser(u); setAuth("app"); };
  const handleLogout = () => { setUser(null); setAuth("login"); };

  if (auth === "login") return <LoginPage users={users} setUsers={setUsers} setUser={handleLogin} goRegister={() => setAuth("register")} />;
  if (auth === "register") return <RegisterPage users={users} setUsers={setUsers} setUser={handleLogin} goLogin={() => setAuth("login")} />;

  return (
    <div className="app-wrap">
      <div className="sidebar">
        <div className="sidebar-logo">NexaBank <span>Banking Dashboard</span></div>
        <div className="nav-section">
          <div className="nav-label">Menu</div>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span> {n.label}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user?.name?.[0] || "U"}</div>
            <div><div className="user-name">{user?.name}</div><div className="user-email">{user?.email}</div></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        {page === "dashboard" && <DashboardPage accounts={accounts} transactions={transactions} budgets={budgets} bills={bills} />}
        {page === "accounts" && <AccountsPage accounts={accounts} setAccounts={setAccounts} transactions={transactions} />}
        {page === "transactions" && <TransactionsPage accounts={accounts} transactions={transactions} setTransactions={setTransactions} />}
        {page === "budgets" && <BudgetsPage budgets={budgets} setBudgets={setBudgets} transactions={transactions} />}
        {page === "bills" && <BillsPage bills={bills} setBills={setBills} />}
        {page === "rewards" && <RewardsPage transactions={transactions} />}
        {page === "insights" && <InsightsPage transactions={transactions} budgets={budgets} />}
      </div>
    </div>
  );
}