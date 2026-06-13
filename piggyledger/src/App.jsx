import { useState } from "react";

function App() {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState("");
  const [created, setCreated] = useState(false);

  // Future: store multiple piggies
  const [piggies, setPiggies] = useState([]);

  const progress = goal
    ? Math.round((saved / goal) * 100)
    : 0;

  function createPiggy() {
    const newPiggy = {
      id: Date.now(),
      name: piggyName,
      goal: Number(goal),
      saved: 0,
    };

    setPiggies([...piggies, newPiggy]);
    setCreated(true);
  }

  function addMoney() {
    setSaved(saved + Number(amount));
    setAmount("");
  }

  if (!created) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>PiggyLedger 🐷</h1>
        <p>Your Personal Finance Bro</p>

        <h2>Create Your Piggy Bank</h2>

        <input
          type="text"
          placeholder="Piggy Name"
          value={piggyName}
          onChange={(e) => setPiggyName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Goal Amount"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <br />
        <br />

        <button onClick={createPiggy}>
          Create Piggy
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>PiggyLedger 🐷</h1>

      <h2>{piggyName}</h2>

      <p>
        ₹{saved} / ₹{goal}
      </p>

      <p>{progress}% Complete</p>

      <div
        style={{
          width: "300px",
          height: "20px",
          backgroundColor: "#ddd",
          margin: "20px auto",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "green",
            borderRadius: "10px",
          }}
        />
      </div>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addMoney}>
        Add Money
      </button>
    </div>
  );
}

export default App;