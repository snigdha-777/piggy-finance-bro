import { useState } from "react";
import "./CreatePiggy.css";

function CreatePiggy({ setPiggy, piggyType, lockedFamilyRole }) {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(""); 
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  
  // Use locked status if previously declared, otherwise default to parent choice
  const [familyRole, setFamilyRole] = useState(lockedFamilyRole || "parent");

  function addMember() {
    if (!member.trim()) return;
    setMembers([...members, member]);
    setMember("");
  }

  function createPiggy() {
    if (!piggyName.trim() || !goal) {
      alert("Please fill out your Piggy Name and Goal Amount!");
      return;
    }

    setPiggy({
      name: piggyName,
      goal: Number(goal),
      date: date, 
      members: piggyType === "Solo" ? [] : members,
      role: piggyType === "Family" ? familyRole : "owner",
      type: piggyType
    });
  }

  return (
    <div className="create-page">
      <div className="create-box">
        {/* Cleaned title statement */}
        <h1 className="create-title">Create Your Piggy</h1>

        {/* 👪 FAMILY INTERACTIVE SPLIT: Only requests input choice if identity isn't locked */}
        {piggyType === "Family" && (
          <div className="role-selection-card">
            <span className="role-title">Select Your Family Role:</span>
            {lockedFamilyRole ? (
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#ff8fa3" }}>
                Identity locked as: {lockedFamilyRole.toUpperCase()} {lockedFamilyRole === "parent" ? "👑" : "🧸"}
              </p>
            ) : (
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
            {familyRole === "child" && (
              <p className="role-notice-text">⚠️ Note: Children can track goals, but deposits are locked in Family vaults.</p>
            )}
          </div>
        )}

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
                  <p key={i} className="member-tag"> oily 👤 {m}</p>
                ))}
              </div>
            )}
          </>
        )}

        <button type="button" className="create-btn" onClick={createPiggy}>Create Piggy</button>
      </div>
    </div>
  );
}

export default CreatePiggy;