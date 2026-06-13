import { useState } from "react";
import "./Dashboard.css";

function Dashboard({ piggy, globalRole, piggyType, onUpdatePiggy }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const currentUserIdentity = globalRole === "parent" ? "Parent 👑" : globalRole === "child" ? "Child 🧸" : "Owner 👤";

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;

    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const formattedTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newLog = {
      timestamp: `${formattedDate}, ${formattedTime}`,
      user: currentUserIdentity,
      type: "deposit",
      amount: Number(depositAmount),
      note: depositNote.trim() || "Saved some coins!"
    };

    onUpdatePiggy({
      ...piggy,
      savedAmount: (piggy.savedAmount || 0) + Number(depositAmount),
      logs: [newLog, ...(piggy.logs || [])]
    });

    setDepositAmount("");
    setDepositNote("");
  };

  const progressPercent = Math.min((((piggy.savedAmount || 0) / piggy.goal) * 100), 100);

  return (
    <div className="dashboard-window-content">
      <h1 className="dashboard-title">{piggy.name}</h1>
      
      {piggy.inviteCode && (
        <div className="invite-badge">
          Share Invite Code: <span>{piggy.inviteCode}</span>
        </div>
      )}

      <p className="savings-display">₹{piggy.savedAmount || 0} / ₹{piggy.goal}</p>

      {/* 📊 PROGRESS CONTAINER */}
      <div className="progress-wrapper">
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="percent-text">{progressPercent.toFixed(0)}% Complete</span>
      </div>

      {/* 💰 TRANSACTION CONTROLLER */}
      <div className="deposit-panel">
        <input 
          type="number" 
          placeholder="Enter Amount (₹)" 
          value={depositAmount} 
          className="dashboard-input"
          onChange={(e) => setDepositAmount(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Attach a message note..." 
          value={depositNote} 
          className="dashboard-input"
          onChange={(e) => setDepositNote(e.target.value)} 
        />
        <button type="button" className="dashboard-btn" onClick={handleDeposit}>
          Feed Piggy 🐷
        </button>
      </div>
    </div>
  );
}

export default Dashboard;