import { useState } from "react";
import "./CreatePiggy.css";

function CreatePiggy({ setPiggy }) {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
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
    members: members,
  };

  setPiggy(pigData);
}

  return (
    <div className="create-page">
      <div className="create-box">
        <h1>Create Your Piggy</h1>

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

        <input type="date" />

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Member Name"
            value={member}
            onChange={(e) => setMember(e.target.value)}
          />

          <button onClick={addMember}>
            Add
          </button>
        </div>

        <div>
          {members.map((m, index) => (
            <p key={index}>
              👤 {m}
            </p>
          ))}
        </div>

        <button onClick={createPiggy}>
          Create Piggy
        </button>
      </div>
    </div>
  );
}

export default CreatePiggy;