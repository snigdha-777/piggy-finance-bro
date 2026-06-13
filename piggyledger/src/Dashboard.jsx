import { useState } from "react";
import "./Dashboard.css";

function Dashboard({ piggy, globalRole, piggyType, onUpdatePiggy, onWithdrawToWallet }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  
  // Withdrawal flow tracking state triggers
  const [isWithdrawRequested, setIsWithdrawRequested] = useState(false);
  const [approvedContributors, setApprovedContributors] = useState([]);

  // Check if adding funds is locked for the user
  const isDepositLockedForUser = piggyType === "Family" && globalRole === "child";

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;

    const newLog = {
      timestamp: new Date().toLocaleString(),
      type: "deposit",
      amount: Number(depositAmount),
      note: depositNote
    };

    onUpdatePiggy({
      ...piggy,
      savedAmount: piggy.savedAmount + Number(depositAmount),
      logs: [newLog, ...piggy.logs]
    });

    setDepositAmount("");
    setDepositNote("");
  };

  const handleRequestWithdrawal = () => {
    if (piggy.savedAmount <= 0) return;
    
    // For Solo mode, skip group checks and withdraw instantly
    if (piggyType === "Solo" || piggy.members.length === 0) {
      onWithdrawToWallet(piggy.savedAmount);
      const clearLog = {
        timestamp: new Date().toLocaleString(),
        type: "withdraw",
        amount: piggy.savedAmount,
        note: "Instant Solo Vault Payout to Wallet 👛"
      };
      onUpdatePiggy({ ...piggy, savedAmount: 0, logs: [clearLog, ...piggy.logs] });
      alert("Funds successfully cashed out to your wallet!");
    } else {
      setIsWithdrawRequested(true);
      setApprovedContributors([]);
    }
  };

  const handleApproveContributor = (name) => {
    if (approvedContributors.includes(name)) return;
    const currentApprovals = [...approvedContributors, name];
    setApprovedContributors(currentApprovals);

    // If everyone in the group has checked off on the withdrawal, release the funds
    if (currentApprovals.length === piggy.members.length) {
      onWithdrawToWallet(piggy.savedAmount);
      const withdrawLog = {
        timestamp: new Date().toLocaleString(),
        type: "withdraw",
        amount: piggy.savedAmount,
        note: `Group Approved Release! Verified by: ${currentApprovals.join(", ")}`
      };
      onUpdatePiggy({ ...piggy, savedAmount: 0, logs: [withdrawLog, ...piggy.logs] });
      setIsWithdrawRequested(false);
      alert("Request approved by all contributors! Funds released to wallet.");
    }
  };

  const progressPercent = Math.min(((piggy.savedAmount / piggy.goal) * 100), 100);

  return (
    <div className="window" style={{ width: "750px", position: "absolute", top: "50%", left: "50%", transform: "translate(-40%, -50%)" }}>
      <div className="titlebar">{piggy.name}.exe — Dashboard ({piggyType} Mode)</div>
      
      <div className="window-content" style={{ padding: "30px" }}>
        <h1 style={{ fontSize: "3.5rem", color: "#ff8fa3" }}>{piggy.name}</h1>
        <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>₹{piggy.savedAmount} / ₹{piggy.goal}</p>

        {/* 📊 PROGRESS TIMELINE */}
        <div className="progress-bar" style={{ width: "100%", maxWidth: "450px" }}>
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", display: "block", marginTop: "5px" }}>
          {progressPercent.toFixed(0)}% Complete
        </span>

        {/* 💰 TRANSACTION CONTROLLER LAYER */}
        {isDepositLockedForUser ? (
          <div className="locked-card" style={{ background: "#f5f5f5", border: "3px dashed #aaa", padding: "15px", borderRadius: "12px", width: "100%", maxWidth: "400px", margin: "20px 0" }}>
            <h3 style={{ margin: 0, color: "#777" }}>🔒 View Only Mode</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.2rem" }}>Children cannot deposit into Family type goals.</p>
          </div>
        ) : (
          <div className="deposit-panel" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "400px", margin: "20px 0" }}>
            <input 
              type="number" 
              placeholder="Enter Amount (₹)" 
              value={depositAmount} 
              style={{ padding: "10px", border: "3px solid #1e1e1e", borderRadius: "12px", textAlign: "center", fontSize: "1.3rem" }}
              onChange={(e) => setDepositAmount(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Attach a message note..." 
              value={depositNote} 
              style={{ padding: "10px", border: "3px solid #1e1e1e", borderRadius: "12px", textAlign: "center", fontSize: "1.2rem" }}
              onChange={(e) => setDepositNote(e.target.value)} 
            />
            <button type="button" onClick={handleDeposit} style={{ padding: "12px", background: "#ff8fa3", color: "white", border: "3px solid #1e1e1e", borderRadius: "12px", fontWeight: "bold", fontSize: "1.3rem", cursor: "pointer" }}>
              Add Money
            </button>
          </div>
        )}

        {/* 🔓 WITHDRAWAL CONTROL FLOW */}
        {piggy.savedAmount > 0 && !isWithdrawRequested && (
          <button type="button" onClick={handleRequestWithdrawal} style={{ background: "#ffb3c1", color: "#1e1e1e", border: "3px solid #1e1e1e", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>
            💸 Withdraw Payout
          </button>
        )}

        {/* 👥 MULTIPARTY VERIFICATION PANEL */}
        {isWithdrawRequested && (
          <div className="approval-card" style={{ background: "#fffdf0", border: "3px solid #1e1e1e", padding: "15px", borderRadius: "16px", width: "100%", maxWidth: "420px", marginTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1.4rem" }}>Waiting on Contributor Approval Checklist:</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {piggy.members.map((name, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem" }}>👤 {name}: {approvedContributors.includes(name) ? "✅ Approved" : "⏳ Pending"}</span>
                  {!approvedContributors.includes(name) && (
                    <button onClick={() => handleApproveContributor(name)} style={{ padding: "2px 8px", background: "#fff", border: "2px solid #1e1e1e", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" }}>Sign</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;