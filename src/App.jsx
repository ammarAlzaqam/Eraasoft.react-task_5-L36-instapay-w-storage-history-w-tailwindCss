import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { FaAmazonPay, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as createId } from "uuid";

const DBPassword = "123456";

/* ── Styles injected once ─────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #07080f;
    --surface:   #0e1018;
    --surface2:  #151721;
    --border:    rgba(255,255,255,0.07);
    --border2:   rgba(255,255,255,0.12);
    --accent:    #6c63ff;
    --accent2:   #a78bfa;
    --green:     #22c55e;
    --red:       #ef4444;
    --text:      #f1f5f9;
    --muted:     #64748b;
    --muted2:    #94a3b8;
    --font:      'Sora', sans-serif;
    --mono:      'JetBrains Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  /* ── Layout ── */
  .ip-page {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 2rem 1rem;
    background:
      radial-gradient(ellipse 60% 40% at 70% 10%, rgba(108,99,255,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 35% at 10% 80%, rgba(167,139,250,0.08) 0%, transparent 60%),
      var(--bg);
  }

  .ip-shell {
    width: 100%;
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 700px) {
    .ip-shell { grid-template-columns: 1fr; }
    .ip-table-panel { display: none; }
  }

  /* ── Card base ── */
  .ip-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
  }

  /* ── Hero panel (left) ── */
  .ip-hero {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ip-hero-top {
    padding: 1.75rem 1.75rem 1.5rem;
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  .ip-hero-top::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(108,99,255,0.07) 0%, transparent 60%);
    pointer-events: none;
  }

  .ip-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
  }

  .ip-logo-icon {
    width: 38px; height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    color: #fff;
    box-shadow: 0 4px 16px rgba(108,99,255,0.4);
  }

  .ip-logo-name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  .ip-logo-name span { color: var(--accent2); }

  .ip-pill {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent2);
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.25);
    border-radius: 99px;
    padding: 3px 10px;
  }

  .ip-welcome {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    margin-bottom: 2px;
  }

  .ip-username {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  /* balance block */
  .ip-balance-block {
    margin-top: 1.25rem;
    padding: 1rem 1.25rem;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .ip-balance-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .ip-balance-amount {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -1px;
    min-height: 38px;
    display: flex;
    align-items: center;
  }

  .ip-balance-currency {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }

  .ip-eye {
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--muted2);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: background 0.2s, color 0.2s;
  }
  .ip-eye:hover { background: var(--border); color: var(--text); }
  .ip-eye.hidden-state { opacity: 0.35; pointer-events: none; cursor: default; }

  /* ── Action panel ── */
  .ip-action {
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  .ip-section-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
  }

  .ip-input-wrap {
    position: relative;
  }

  .ip-prefix {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 500;
    color: var(--accent2);
    pointer-events: none;
  }

  .ip-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 14px;
    padding: 14px 14px 14px 46px;
    font-family: var(--mono);
    font-size: 18px;
    font-weight: 500;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    appearance: textfield;
  }
  .ip-input::-webkit-outer-spin-button,
  .ip-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .ip-input:focus { border-color: var(--accent); }
  .ip-input::placeholder { color: var(--muted); font-weight: 400; font-size: 15px; }

  .ip-error {
    font-size: 12px;
    font-weight: 500;
    color: var(--red);
    min-height: 16px;
    padding-left: 2px;
  }

  .ip-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .ip-btn {
    padding: 13px 10px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: transform 0.15s, opacity 0.15s;
    letter-spacing: -0.2px;
  }
  .ip-btn:active { transform: scale(0.96); }

  .ip-btn-dep {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    box-shadow: 0 4px 20px rgba(108,99,255,0.3);
  }
  .ip-btn-dep:hover { opacity: 0.9; }

  .ip-btn-wit {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
  }
  .ip-btn-wit:hover { background: rgba(239,68,68,0.18); }

  /* ── Table panel (right) ── */
  .ip-table-panel {
    display: flex;
    flex-direction: column;
  }

  .ip-table-head {
    padding: 1.5rem 1.75rem 1rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ip-table-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .ip-count-badge {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent2);
    background: rgba(108,99,255,0.15);
    border-radius: 99px;
    padding: 2px 9px;
  }

  .ip-table-scroll {
    overflow-y: auto;
    max-height: 420px;
    padding: 0.75rem 0;
  }

  .ip-table-empty {
    padding: 3rem 1.75rem;
    text-align: center;
    font-size: 13px;
    color: var(--muted);
  }

  .ip-txn-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 1.75rem;
    transition: background 0.15s;
    cursor: default;
  }
  .ip-txn-row:hover { background: var(--surface2); }

  .ip-txn-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    font-weight: 700;
  }
  .ip-txn-icon.dep { background: rgba(34,197,94,0.12); color: var(--green); }
  .ip-txn-icon.wit { background: rgba(239,68,68,0.12); color: var(--red); }

  .ip-txn-info { flex: 1; min-width: 0; }
  .ip-txn-type { font-size: 13px; font-weight: 600; color: var(--text); text-transform: capitalize; }
  .ip-txn-date { font-size: 10px; color: var(--muted); margin-top: 1px; font-family: var(--mono); }

  .ip-txn-right { text-align: right; flex-shrink: 0; }
  .ip-txn-amount {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 500;
  }
  .ip-txn-amount.dep { color: var(--green); }
  .ip-txn-amount.wit { color: var(--red); }
  .ip-txn-after { font-size: 10px; color: var(--muted); margin-top: 1px; font-family: var(--mono); }

  .ip-divider { height: 1px; background: var(--border); margin: 0 1.75rem; }

  /* ── Modal ── */
  .ip-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }

  .ip-modal {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 24px;
    padding: 2rem;
    width: 100%; max-width: 360px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: slideUp 0.22s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .ip-modal-icon {
    width: 52px; height: 52px;
    border-radius: 16px;
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    color: var(--accent2);
    margin: 0 auto 1.25rem;
  }

  .ip-modal h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    text-align: center;
    margin-bottom: 4px;
    letter-spacing: -0.3px;
  }

  .ip-modal p {
    font-size: 13px;
    color: var(--muted);
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .ip-modal-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 12px;
    padding: 13px 14px;
    font-family: var(--font);
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 6px;
  }
  .ip-modal-input:focus { border-color: var(--accent); }
  .ip-modal-input::placeholder { color: var(--muted); }

  .ip-modal-submit {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: opacity 0.15s;
    letter-spacing: -0.2px;
    box-shadow: 0 4px 16px rgba(108,99,255,0.3);
  }
  .ip-modal-submit:hover { opacity: 0.9; }

  .ip-modal-cancel {
    width: 100%; padding: 10px;
    background: none; border: none;
    font-family: var(--font);
    font-size: 13px; color: var(--muted);
    cursor: pointer; margin-top: 4px;
    transition: color 0.15s;
  }
  .ip-modal-cancel:hover { color: var(--text); }

  /* ── Undo button ── */
  .ip-undo-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid rgba(167,139,250,0.25);
    background: rgba(108,99,255,0.1);
    color: var(--accent2);
    font-family: var(--font);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ip-undo-btn:hover {
    background: rgba(108,99,255,0.2);
    border-color: rgba(167,139,250,0.45);
  }

  /* balance animation */
  @keyframes flashGreen {
    0%   { color: var(--text); }
    40%  { color: var(--green); transform: scale(1.06); }
    100% { color: var(--text); transform: scale(1); }
  }
  @keyframes flashRed {
    0%   { color: var(--text); }
    40%  { color: var(--red); transform: scale(0.95); }
    100% { color: var(--text); transform: scale(1); }
  }
  .anim-up   { animation: flashGreen 0.5s ease; display: inline-block; }
  .anim-down { animation: flashRed   0.5s ease; display: inline-block; }
`;

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt = (n) =>
  Number(n).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ── VerifyPasswordModal (for eye / show balance) ────────────── */
const VerifyPasswordModal = ({ setShowBalance }) => {
  const passwordInput = useRef();
  const [errorMsg, setErrorMsg] = useState("");

  const verifyPassword = () => {
    const password = passwordInput.current.value;
    if (DBPassword == password) {
      setShowBalance(true);
      setErrorMsg("");
      passwordInput.current.value = "";
      document.getElementById("verify_password_modal").close();
      toast.success("Login success...");
    } else {
      setErrorMsg("Password not correct ❌");
    }
  };

  return (
    <dialog
      id="verify_password_modal"
      className="modal"
      style={{ background: "transparent", border: "none" }}
    >
      <div className="ip-modal">
        <div className="ip-modal-icon">🔐</div>
        <h3>Verify Identity</h3>
        <p>Enter your password to reveal your balance</p>
        <input
          type="password"
          className="ip-modal-input"
          placeholder="Enter your password"
          ref={passwordInput}
          onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
        />
        {errorMsg && (
          <p
            style={{
              fontSize: 12,
              color: "var(--red)",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            {errorMsg}
          </p>
        )}
        <button onClick={verifyPassword} className="ip-modal-submit">
          Confirm
        </button>
        <button
          className="ip-modal-cancel"
          onClick={() =>
            document.getElementById("verify_password_modal").close()
          }
        >
          Cancel
        </button>
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
        style={{ background: "transparent" }}
      >
        <button>close</button>
      </form>
    </dialog>
  );
};

/* ── VerifyPasswordModal2 (for action while hidden) ──────────── */
const VerifyPasswordModal2 = ({ setShowBalance, changeAmount }) => {
  const passwordInput = useRef();
  const [errorMsg, setErrorMsg] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const actionType = queryParams.get("actionType");

  const verifyPassword = () => {
    const password = passwordInput.current.value;
    if (DBPassword == password) {
      setShowBalance(true);
      setErrorMsg("");
      passwordInput.current.value = "";
      document.getElementById("verify_password_modal2").close();
      changeAmount(actionType, true);
    } else {
      setErrorMsg("Password not correct ❌");
    }
  };

  return (
    <dialog
      id="verify_password_modal2"
      className="modal"
      style={{ background: "transparent", border: "none" }}
    >
      <div className="ip-modal">
        <div className="ip-modal-icon">🔒</div>
        <h3>Confirm Action</h3>
        <p>Verify your identity to proceed with this transaction</p>
        <input
          type="password"
          className="ip-modal-input"
          placeholder="Enter your password"
          ref={passwordInput}
          onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
        />
        {errorMsg && (
          <p
            style={{
              fontSize: 12,
              color: "var(--red)",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            {errorMsg}
          </p>
        )}
        <button onClick={verifyPassword} className="ip-modal-submit">
          Confirm
        </button>
        <button
          className="ip-modal-cancel"
          onClick={() =>
            document.getElementById("verify_password_modal2").close()
          }
        >
          Cancel
        </button>
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
        style={{ background: "transparent" }}
      >
        <button>close</button>
      </form>
    </dialog>
  );
};

/* ── App ─────────────────────────────────────────────────────── */
const App = () => {
  const [balance, setBalance] = useState(+localStorage.getItem("balance") || 0);
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || [],
  );
  const [showBalance, setShowBalance] = useState(
    !!+localStorage.getItem("showBalance") || false,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const [undoSnapshot, setUndoSnapshot] = useState(null); // { balance, transactions }
  const amountInput = useRef();
  const navigate = useNavigate();
  const prevBalance = useRef(balance);

  useEffect(() => {
    localStorage.setItem("showBalance", showBalance ? 1 : 0);
  }, [showBalance]);

  useEffect(() => {
    localStorage.setItem("balance", +balance);
    if (balance > prevBalance.current) setAnimClass("anim-up");
    else if (balance < prevBalance.current) setAnimClass("anim-down");
    setAnimKey((k) => k + 1);
    prevBalance.current = balance;
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const changeAmount = (actionType, isVerified) => {
    const amount = amountInput.current.value;
    if (+amount <= 0) {
      setErrorMsg("Enter a valid amount ( >0 )");
      return;
    }
    setErrorMsg("");
    if (showBalance || isVerified) {
      if (actionType === "deposit") {
        setUndoSnapshot({ balance, transactions: [...transactions] });
        setBalance(balance + +amount);
        amountInput.current.value = "";
        setTransactions([
          ...transactions,
          {
            id: createId(),
            type: actionType,
            amount,
            balanceAfter: balance + +amount,
            createdAt: dayjs().format("DD/MM/YYYY - HH:mm"),
          },
        ]);
        toast.success("Successfully added.");
      } else if (actionType === "withdraw" && balance >= amount) {
        setUndoSnapshot({ balance, transactions: [...transactions] });
        setBalance(balance - +amount);
        amountInput.current.value = "";
        setTransactions([
          ...transactions,
          {
            id: createId(),
            type: actionType,
            amount,
            balanceAfter: balance - +amount,
            createdAt: dayjs().format("DD/MM/YYYY - HH:mm"),
          },
        ]);
        toast.success("Successfully withdrawn.");
      } else if (balance < amount) {
        setErrorMsg("Don't have enough balance");
      }
    } else {
      document.getElementById("verify_password_modal2").showModal();
      navigate(`?actionType=${actionType}`);
    }
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    setBalance(undoSnapshot.balance);
    setTransactions(undoSnapshot.transactions);
    setUndoSnapshot(null);
    toast("Transaction undone ↩", { icon: "↩" });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ip-page">
        <div className="ip-shell">
          {/* ── Left panel ── */}
          <div className="ip-card ip-hero">
            <div className="ip-hero-top">
              {/* Logo */}
              <div className="ip-logo">
                <div className="ip-logo-icon">
                  <FaAmazonPay />
                </div>
                <span className="ip-logo-name">
                  insta<span>pay</span>
                </span>
                <span className="ip-pill">Personal</span>
              </div>

              {/* User */}
              <p className="ip-welcome">Welcome back,</p>
              <p className="ip-username">Ammar Alzaqam</p>

              {/* Balance */}
              <div className="ip-balance-block">
                <div>
                  <p className="ip-balance-label">Available Balance</p>
                  <div className="ip-balance-amount">
                    {showBalance ? (
                      <span key={animKey} className={animClass}>
                        {fmt(balance)}
                      </span>
                    ) : (
                      <span style={{ letterSpacing: 4, color: "var(--muted)" }}>
                        — — —
                      </span>
                    )}
                  </div>
                  <p className="ip-balance-currency">EGP · Egyptian Pound</p>
                </div>
                <button
                  className={`ip-eye ${showBalance ? "hidden-state" : ""}`}
                  onClick={() =>
                    document.getElementById("verify_password_modal").showModal()
                  }
                >
                  {showBalance ? (
                    <FaRegEyeSlash
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBalance(false);
                      }}
                    />
                  ) : (
                    <BsEye />
                  )}
                </button>
              </div>

              <VerifyPasswordModal setShowBalance={setShowBalance} />
            </div>

            {/* Action area */}
            <div className="ip-action">
              <p className="ip-section-label">Quick Transfer</p>

              <div>
                <div className="ip-input-wrap">
                  <span className="ip-prefix">E£</span>
                  <input
                    ref={amountInput}
                    type="text"
                    className="ip-input"
                    placeholder="0.00"
                    onChange={() => errorMsg && setErrorMsg("")}
                  />
                </div>
                <p className="ip-error">{errorMsg}</p>
              </div>

              <div className="ip-btns">
                <button
                  className="ip-btn ip-btn-dep"
                  onClick={() => changeAmount("deposit")}
                >
                  ↓ Deposit
                </button>
                <button
                  className="ip-btn ip-btn-wit"
                  onClick={() => changeAmount("withdraw")}
                >
                  ↑ Withdraw
                </button>
              </div>

              <VerifyPasswordModal2
                setShowBalance={setShowBalance}
                changeAmount={changeAmount}
              />
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="ip-card ip-table-panel">
            <div className="ip-table-head">
              <span className="ip-table-title">Transaction History</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {undoSnapshot && (
                  <button className="ip-undo-btn" onClick={handleUndo}>
                    ↩ Undo last
                  </button>
                )}
                {transactions.length > 0 && (
                  <span className="ip-count-badge">{transactions.length}</span>
                )}
              </div>
            </div>

            <div className="ip-table-scroll">
              {transactions.length === 0 ? (
                <div className="ip-table-empty">No transactions yet</div>
              ) : (
                [...transactions].reverse().map((t, i) => (
                  <div key={t.id}>
                    <div
                      className="ip-txn-row"
                      style={
                        i === 0 && undoSnapshot
                          ? {
                              background: "rgba(108,99,255,0.06)",
                              borderLeft: "2px solid var(--accent)",
                            }
                          : {}
                      }
                    >
                      <div
                        className={`ip-txn-icon ${t.type === "deposit" ? "dep" : "wit"}`}
                      >
                        {t.type === "deposit" ? "↓" : "↑"}
                      </div>
                      <div className="ip-txn-info">
                        <p className="ip-txn-type">
                          {t.type}
                          {i === 0 && undoSnapshot && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 9,
                                fontWeight: 600,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                color: "var(--accent2)",
                                background: "rgba(108,99,255,0.15)",
                                borderRadius: 4,
                                padding: "1px 5px",
                              }}
                            >
                              latest
                            </span>
                          )}
                        </p>
                        <p className="ip-txn-date">{t.createdAt}</p>
                      </div>
                      <div className="ip-txn-right">
                        <p
                          className={`ip-txn-amount ${t.type === "deposit" ? "dep" : "wit"}`}
                        >
                          {t.type === "deposit" ? "+" : "-"}E£{fmt(t.amount)}
                        </p>
                        <p className="ip-txn-after">
                          bal: {fmt(t.balanceAfter)}
                        </p>
                      </div>
                    </div>
                    {i < transactions.length - 1 && (
                      <div className="ip-divider" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
