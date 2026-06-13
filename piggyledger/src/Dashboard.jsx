import { useState, useEffect } from "react";
import "./Dashboard.css";
import pigImage from "./assets/pig1.png";

function Dashboard({ piggy }) {
  const [coinsArray, setCoinsArray] = useState([]);
  const [saved, setSaved] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);

  if (!piggy) {
    return <h1>Loading...</h1>;
  }

  function addMoney() {
    if (!amount || Number(amount) <= 0) return;

    const numAmount = Number(amount);
    const targetGoal = Number(piggy.goal) || 1;
    
    const percentageOfGoal = (numAmount / targetGoal) * 100;

    let coinCount = 1;
    if (percentageOfGoal >= 50) {
      coinCount = 5;
    } else if (percentageOfGoal >= 25) {
      coinCount = 3;
    }

    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: Date.now() + i,
      delay: i * 120 
    }));

    setCoinsArray(newCoins);

    setTimeout(() => {
      setCoinsArray([]);
      setIsBouncing(true);
    }, 900 + (coinCount * 120));

    setSaved(saved + numAmount);
    setTransactions([
      `+ ₹${numAmount}`,
      ...transactions
    ]);
    setAmount("");
  }

  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => setIsBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  const progress = (saved / Number(piggy.goal)) * 100;
  const currentProgressWidth = `${Math.min(progress, 100)}%`;

  return (
    <div className="dashboard">
      <h1>{piggy.name}</h1>

      <div className="coin-shower">
        {coinsArray.map((coin) => (
          <div
            key={coin.id}
            className="coin"
            style={{ animationDelay: `${coin.delay}ms` }}
          >
            🪙
          </div>
        ))}
      </div>

      <div className="pig-container">
        <img 
          src={pigImage} 
          alt="Piggy Box" 
          className={`pig-image ${isBouncing ? "bounce" : ""}`}
        />
      </div>

      <h2 className="goal-title">
        ₹{saved} / ₹{piggy.goal}
      </h2>

      <div className="progress-wrapper">
        <div className="progress-container">
          <div
            className="progress-fill"
            style={{ width: currentProgressWidth }}
          ></div>
        </div>
        <p>{progress.toFixed(0)}% Complete</p>
      </div>

      <div className="action-card">
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="button" onClick={addMoney}>
          Add Money
        </button>

        {saved >= Number(piggy.goal) && (
          <h2 className="goal-achieved">🎉 Goal Achieved!</h2>
        )}
      </div>

      <div className="transactions">
        <h3>Recent Activity</h3>
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <p style={{ color: "#aaaaaa", fontWeight: "normal" }}>No transactions yet</p>
          ) : (
            transactions.map((transaction, index) => (
              <p key={index} className="transaction-item">
                {transaction}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="secondary-actions">
        <button type="button">Request Withdrawal</button>
        <button type="button">Monthly Letter</button>
      </div>
    </div>
  );
}

export default Dashboard;