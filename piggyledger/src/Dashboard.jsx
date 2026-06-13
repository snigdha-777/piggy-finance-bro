import { useState } from "react";
import "./Dashboard.css";

function Dashboard({ piggy }) {

  const [showCoin, setShowCoin] = useState(false);
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  if (!piggy) {
    return <h1>Loading...</h1>;
  }

  function addMoney() {

    if (!amount || Number(amount) <= 0) return;

    const numAmount = Number(amount);

    setShowCoin(true);

    setTimeout(() => {
      setShowCoin(false);
    }, 1000);

    setSaved(saved + numAmount);

    setTransactions([
      ...transactions,
      `+ ₹${numAmount}`
    ]);

    setAmount("");
  }

  const progress = (saved / Number(piggy.goal)) * 100;

  return (
    <div className="dashboard">

      <h1>{piggy.name}</h1>

      {showCoin && (
        <div className="coin">
          🪙
        </div>
      )}

      <div
        className={`pig ${showCoin ? "bounce" : ""}`}
        style={{
          transform: `scale(${1 + progress / 100})`
        }}
      >
        🐷
      </div>

      <h2>
        ₹{saved} / ₹{piggy.goal}
      </h2>

      <div className="progress-container">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        ></div>
      </div>

      <p>
        {progress.toFixed(0)}% Complete
      </p>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={addMoney}>
        Add Money
      </button>

      {saved >= Number(piggy.goal) && (
        <h2 className="goal-achieved">
          🎉 Goal Achieved!
        </h2>
      )}

      <div className="transactions">

        <h3>Recent Activity</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((transaction, index) => (
            <p key={index}>
              {transaction}
            </p>
          ))
        )}

      </div>

      <button>
        Request Withdrawal
      </button>

      <button>
        Monthly Letter
      </button>

    </div>
  );
}

export default Dashboard;