import { useState } from "react";

function App() {
  const [piggyName, setPiggyName] = useState("");
  const [goal, setGoal] = useState("");
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState("");
  const [created, setCreated] = useState(false);

  function createPiggy() {
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

        <br /><br />

        <input
          type="number"
          placeholder="Goal Amount"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <br /><br />

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

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={addMoney}>
        Add Money
      </button>
    </div>
  );
}

export default App;