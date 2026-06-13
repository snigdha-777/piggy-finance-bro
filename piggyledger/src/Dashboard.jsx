import { useState } from "react";
import "./Dashboard.css";

function Dashboard({
  piggy,
  globalRole,
  piggyType,
  globalWallet,
  setGlobalWallet,
  onUpdatePiggy
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

  // 🚨 REVISED WITHDRAWAL ALGORITHMS WITH CONSENT RULES
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

    // Rule 1: Solo Piggy Vaults -> Direct Confirmation
    if (piggy.type !== "family") {
      const confirmSolo = window.confirm(`Are you sure you want to withdraw ₹${amount} from your Solo vault?`);
      if (confirmSolo) {
        finalizeWithdrawal(amount);
      }
      return;
    }

    // Rule 2: Shared Family Vaults -> Requires Permission from each active contributor
    if (piggy.contributors && piggy.contributors.length > 0) {
      alert(`⚠️ Shared Vault Rule Triggered!\nThis action requires consent from all registered participants.`);
      
      let allApproved = true;
      for (let i = 0; i < piggy.contributors.length; i++) {
        const approval = window.confirm(`[VOTE] Does family member "${piggy.contributors[i]}" approve this ₹${amount} withdrawal?`);
        if (!approval) {
          allApproved = false;
          break;
        }
      }

      if (allApproved) {
        alert("🎉 Excellent! All contributors voted YES. Processing funds transfer...");
        finalizeWithdrawal(amount);
      } else {
        alert("❌ Withdrawal Denied! One or more family members rejected your request.");
      }
    } else {
      // Fallback fallback if no family members entered yet
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

    setGlobalWallet(globalWallet + amount); // Adds money back to wallet
    onUpdatePiggy({
      ...piggy,
      savedAmount: (piggy.savedAmount || 0) - amount,
      logs: [newLog, ...(piggy.logs || [])]
    });

    setWithdrawAmount("");
  };

  const progressPercent = Math.min((((piggy.savedAmount || 0) / piggy.goal) * 100), 100);

  return (
    <div className="dashboard-content-wrapper">
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

      {/* 💰 DEPOSIT PANEL */}
      <div className="deposit-panel" style={{ marginBottom: "15px" }}>
        <h3>Feed Piggy 🪙</h3>
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

      {/* 🔓 WITHDRAWAL PANEL */}
      <div className="deposit-panel" style={{ background: "#fff0f3", borderColor: "#e63946" }}>
        <h3>Break Open Vault 🔨</h3>
        <input 
          type="number" 
          placeholder="Amount to extract (₹)" 
          value={withdrawAmount} 
          className="dashboard-input"
          onChange={(e) => setWithdrawAmount(e.target.value)} 
        />
        <button type="button" className="dashboard-btn" style={{ background: "#e63946" }} onClick={handleWithdrawalRequest}>
          Request Funds Release
        </button>
      </div>
    </div>
  );
}

export default Dashboard;