import { useState } from "react";
import "./CreatePiggy.css";

function CreatePiggy({ 
  setPiggy, 
  piggyType, 
  globalRole,       // Added missing prop so localRole can use it
  setGlobalRole, 
  playClick 
}) {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(""); 
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [localRole, setLocalRole] = useState(globalRole || "parent");

  function addMember() {
    const cleanMember = member.trim();
    if (!cleanMember) return;

    if (piggyType === "Friends" && members.length >= 6) {
      alert("You can add a maximum of 6 friends!");
      return;
    }

    if (members.includes(cleanMember)) {
      alert("Member already added!");
      return;
    }

    if (typeof playClick === "function") playClick();
    setMembers([...members, cleanMember]);
    setMember("");
  }

  function removeMember(indexToRemove) {
    if (typeof playClick === "function") playClick();
    setMembers(members.filter((_, idx) => idx !== indexToRemove));
  }

  function handleJoinCode() {
    if (!inviteCodeInput.trim()) {
      alert("Please enter a valid family invite code!");
      return;
    }
    
    if (typeof playClick === "function") playClick();
    setGlobalRole("child");
    setPiggy({
      name: "Family Vault",
      goal: 50000,
      savedAmount: 15000,
      date: "2026-12-31",
      members: ["Parent 👑", "Child 🧸"],
      role: "child",
      type: "Family",
      inviteCode: inviteCodeInput.trim(),
      logs: [
        { timestamp: "13-06-2026, 14:22", user: "Parent 👑", type: "deposit", amount: 15000, note: "Initial family pool setup." }
      ]
    });
  }

  function createPiggy() {
    if (!piggyName.trim() || !goal) {
      alert("Please fill out your Piggy Name and Goal Amount!");
      return;
    }

    if (piggyType === "Friends" && members.length < 2) {
      alert("Please add at least 2 friends to start a group vault!");
      return;
    }

    const isFamily = piggyType === "Family";
    const isGroup = piggyType === "Family" || piggyType === "Friends";
    const generatedCode = isGroup ? "PIGGY-" + Math.floor(1000 + Math.random() * 9000) : null;
    
    if (typeof playClick === "function") playClick();
    setGlobalRole(isFamily ? localRole : "parent");

    setPiggy({
      name: piggyName.trim(),
      goal: Number(goal),
      savedAmount: 0,
      date: date, 
      members: isGroup ? ["Creator", ...members] : [],
      role: isFamily ? localRole : "parent",
      type: piggyType,
      inviteCode: generatedCode,
      logs: []
    });
  }

  return (
    <div className="create-page">
      <div className="create-box">
        <h1 className="create-title">Create Your Piggy</h1>

        {piggyType === "Family" && (
          <div className="role-selection-card">
            <span className="role-title">Select Your Family Role:</span>
            <div className="role-btn-group">
              <button
                type="button"
                className={`role-toggle-btn ${localRole === "parent" ? "active" : ""}`}
                onClick={() => { if (typeof playClick === "function") playClick(); setLocalRole("parent"); }}
              >
                Parent 👑
              </button>
              <button
                type="button"
                className={`role-toggle-btn ${localRole === "child" ? "active" : ""}`}
                onClick={() => { if (typeof playClick === "function") playClick(); setLocalRole("child"); }}
              >
                Child 🧸
              </button>
            </div>
          </div>
        )}

        {piggyType === "Family" && localRole === "child" ? (
          <div className="child-join-panel">
            <p className="role-notice-text">🧸 Children cannot create goals. Enter a code from a family member to join:</p>
            <input
              type="text"
              placeholder="Enter Invite Code (e.g., PIGGY-1234)"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value)}
              className="dashboard-retro-input"
              style={{ textAlign: 'center', marginBottom: '10px' }}
            />
            <button type="button" className="create-btn" onClick={handleJoinCode}>Join Family Goal</button>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Piggy Name"
              value={piggyName}
              onChange={(e) => setPiggyName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Goal Amount"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            {(piggyType === "Family" || piggyType === "Friends") && (
              <>
                <div className="member-input-group">
                  <input
                    type="text"
                    placeholder={piggyType === "Friends" ? "Friend Name" : "Member Name"}
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                  />
                  <button type="button" className="add-btn" onClick={addMember}>Add</button>
                </div>
                {members.length > 0 && (
                  <div className="members-list">
                    {members.map((m, i) => (
                      <div key={i} className="member-tag">
                        <span>👤 {m}</span>
                        <span 
                          onClick={() => removeMember(i)} 
                          style={{ cursor: "pointer", color: "#ff8fa3", fontWeight: "bold" }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <button type="button" className="create-btn" onClick={createPiggy}>Create Piggy</button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatePiggy;