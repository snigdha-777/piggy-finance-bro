import { useState } from "react";
import "./Dashboard.css";

function Dashboard({
  piggy,
  globalRole,
  globalWallet,
  setGlobalWallet,
  onUpdatePiggy,
  playClick
}) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const currentUserIdentity = globalRole === "parent" ? "Parent 👑" : globalRole === "child" ? "Child 🧸" : "Owner 👤";

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    if (amount > globalWallet) {
      alert("Not enough money in wallet! 💸");
      return;
    }

    if (typeof playClick === "function") playClick();

    const formattedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formattedTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const newLog = {
      timestamp: `${formattedDate}, ${formattedTime}`,
      user: currentUserIdentity,
      type: "deposit",
      amount,
      note: depositNote.trim() || "Saved some coins!"
    };

    setGlobalWallet(globalWallet - amount);
    onUpdatePiggy({
      ...piggy,
      savedAmount: (piggy.savedAmount || 0) + amount,
      logs: [newLog, ...(piggy.logs || [])]
    });

    setDepositAmount("");
    setDepositNote("");
  };

  const handleWithdrawalRequest = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount to withdraw!");
      return;
    }
    if (amount > (piggy.savedAmount || 0)) {
      alert("You cannot withdraw more than what is inside the Piggy! 🚫");
      return;
    }

    if (piggy.type !== "Family") {
      const confirmSolo = window.confirm(`Are you sure you want to withdraw ₹${amount}?`);
      if (confirmSolo) {
        if (typeof playClick === "function") playClick();
        finalizeWithdrawal(amount);
      }
      return;
    }

    if (piggy.members && piggy.members.length > 0) {
      alert(`⚠️ Shared Vault Rule Triggered!\nThis action requires consent from all registered participants.`);
      let allApproved = true;
      
      for (let i = 0; i < piggy.members.length; i++) {
        if (piggy.members[i] === "Creator") continue; 
        const approval = window.confirm(`[VOTE] Does contributor "${piggy.members[i]}" approve this ₹${amount} withdrawal?`);
        if (!approval) {
          allApproved = false;
          break;
        }
      }

      if (allApproved) {
        alert("🎉 Excellent! All contributors voted YES. Processing funds transfer...");
        if (typeof playClick === "function") playClick();
        finalizeWithdrawal(amount);
      } else {
        alert("❌ Withdrawal Denied! Consensus was not reached.");
      }
    } else {
      if (typeof playClick === "function") playClick();
      finalizeWithdrawal(amount);
    }
  };

  const finalizeWithdrawal = (amount) => {
    const formattedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formattedTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const newLog = {
      timestamp: `${formattedDate}, ${formattedTime}`,
      user: currentUserIdentity,
      type: "withdraw",
      amount,
      note: "Approved withdrawal moved back to wallet!"
    };

    setGlobalWallet(globalWallet + amount);
    onUpdatePiggy({
      ...piggy,
      savedAmount: (piggy.savedAmount || 0) - amount,
      logs: [newLog, ...(piggy.logs || [])]
    });
    setWithdrawAmount("");
  };

  const progressPercent = piggy.goal > 0 ? Math.min(((piggy.savedAmount || 0) / piggy.goal) * 100, 100) : 0;

  return (
    <div className="dashboard-scroll-body">
      {piggy.inviteCode && (
        <div className="dashboard-invite-badge">
          Invite Code: {piggy.inviteCode}
        </div>
      )}

      <h1 className="dashboard-display-title">{piggy.name}</h1>
      
      <p className="savings-display-text">
        ₹{piggy.savedAmount || 0} / ₹{piggy.goal}
      </p>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="progress-percent-label">
          {progressPercent.toFixed(0)}% Complete
        </span>
      </div>

      {/* DEPOSIT ACTION PANEL */}
      <div className="dashboard-action-panel">
        <input 
          type="number" 
          placeholder="Amount to deposit (₹)" 
          value={depositAmount} 
          onChange={(e) => setDepositAmount(e.target.value)} 
          className="dashboard-retro-input"
        />
        <input 
          type="text" 
          placeholder="Attach a message note..." 
          value={depositNote} 
          onChange={(e) => setDepositNote(e.target.value)} 
          className="dashboard-retro-input"
        />
        <button type="button" className="dashboard-feed-btn" onClick={handleDeposit}>
          Feed Piggy 🐷
        </button>
      </div>

      {/* WITHDRAWAL ACTION PANEL */}
      <div className="dashboard-action-panel withdrawal-border">
        <span className="break-vault-title">
          Break Open Vault 🔨
        </span>
        <input 
          type="number" 
          placeholder="Amount to extract (₹)" 
          value={withdrawAmount} 
          onChange={(e) => setWithdrawAmount(e.target.value)} 
          className="dashboard-retro-input"
        />
        <button type="button" className="dashboard-withdraw-btn" onClick={handleWithdrawalRequest}>
          Request Funds Release
        </button>
      </div>
    </div>
  );
}

export default Dashboard;