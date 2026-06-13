import { useState } from "react";
import "./CreatePiggy.css";

function CreatePiggy({ setPiggy, piggyType, lockedFamilyRole, setGlobalRole }) {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(""); 
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  
  const [familyRole, setFamilyRole] = useState(lockedFamilyRole || "parent");

  function addMember() {
    if (!member.trim()) return;
    setMembers([...members, member]);
    setMember("");
  }

  function handleJoinCode() {
    if (!inviteCodeInput.trim()) {
      alert("Please enter a valid family invite code!");
      return;
    }
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
        { timestamp: "13-06-2026, 14:22", user: "Parent 👑", type: "deposit", amount: 15000, note: "Initial family base pool setup." }
      ]
    });
  }

  function createPiggy() {
    if (!piggyName.trim() || !goal) {
      alert("Please fill out your Piggy Name and Goal Amount!");
      return;
    }

    const generatedCode = piggyType === "Family" ? "PIGGY-" + Math.floor(1000 + Math.random() * 9000) : null;
    setGlobalRole(piggyType === "Family" ? familyRole : "owner");

    setPiggy({
      name: piggyName,
      goal: Number(goal),
      savedAmount: 0,
      date: date, 
      members: piggyType === "Solo" ? [] : ["Creator", ...members],
      role: piggyType === "Family" ? familyRole : "owner",
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
            {!lockedFamilyRole && (
              <div className="role-btn-group">
                <button
                  type="button"
                  className={`role-toggle-btn ${familyRole === "parent" ? "active" : ""}`}
                  onClick={() => setFamilyRole("parent")}
                >
                  Parent 👑
                </button>
                <button
                  type="button"
                  className={`role-toggle-btn ${familyRole === "child" ? "active" : ""}`}
                  onClick={() => setFamilyRole("child")}
                >
                  Child 🧸
                </button>
              </div>
            )}
          </div>
        )}

        {piggyType === "Family" && familyRole === "child" ? (
          <div className="child-join-panel">
            <p className="role-notice-text">🧸 Children cannot create goals. Enter a code from a family member to join:</p>
            <input
              type="text"
              placeholder="Enter Invite Code (e.g., PIGGY-1234)"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value)}
              className="code-input"
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

            {piggyType !== "Solo" && (
              <>
                <div className="member-input-group">
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                  />
                  <button type="button" className="add-btn" onClick={addMember}>Add</button>
                </div>
                {members.length > 0 && (
                  <div className="members-list">
                    {members.map((m, i) => (
                      <p key={i} className="member-tag">👤 {m}</p>
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