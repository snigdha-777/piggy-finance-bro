import { useState } from "react";
import "./CreatePiggy.css";

function CreatePiggy({ setPiggy }) {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(""); 
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);

  function addMember() {
    if (!member.trim()) return;
    setMembers([...members, member]);
    setMember("");
  }

  function createPiggy() {
    const pigData = {
      name: piggyName,
      goal: goal,
      date: date, 
      members: members,
    };
    setPiggy(pigData);
  }

  return (
    <div className="create-page">
      <div className="create-box">
        <h1 className="create-title">Create Your Piggy</h1>

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

        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="member-input-group">
          <input
            type="text"
            placeholder="Member Name"
            value={member}
            onChange={(e) => setMember(e.target.value)}
          />
          <button type="button" className="add-btn" onClick={addMember}>
            Add
          </button>
        </div>

        {members.length > 0 && (
          <div className="members-list">
            {members.map((m, index) => (
              <p key={index} className="member-tag">👤 {m}</p>
            ))}
          </div>
        )}

        <button type="button" className="create-btn" onClick={createPiggy}>
          Create Piggy
        </button>
      </div>
    </div>
  );
}

export default CreatePiggy;