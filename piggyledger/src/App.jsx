// src/App.jsx
import { useState } from "react";
import LandingPage from "./LandingPage";
import ChooseType from "./ChooseType";
import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";

// Import custom icon assets
import pigicon from "./assets/pigicon.png";
import passbookicon from "./assets/passbookicon.png";
import lettericon from "./assets/lettericon.png";
import taskbarImg from "./assets/taskbar.jpeg";

function App() {
  const [currentStep, setCurrentStep] = useState("landing");
  const [piggies, setPiggies] = useState([]);
  const [activePiggyIndex, setActivePiggyIndex] = useState(null);
  const [globalWallet, setGlobalWallet] = useState(0);
  const [lockedFamilyRole, setLockedFamilyRole] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [desktopWindow, setDesktopWindow] = useState("desktop");

  const handleStartLanding = () => setCurrentStep("type");

  const handleSelectType = (type) => {
    setSelectedType(type);
    setCurrentStep("create");
  };

  const handleCreateComplete = (newPiggy) => {
    if (newPiggy.role && !lockedFamilyRole) {
      setLockedFamilyRole(newPiggy.role);
    }
    setPiggies([...piggies, newPiggy]);
    setActivePiggyIndex(piggies.length);
    setCurrentStep("dashboard");
    setDesktopWindow("desktop");
  };

  const handleGoBackToType = () => {
    setCurrentStep("type");
    setDesktopWindow("desktop");
  };

  if (currentStep === "landing") return <LandingPage onStart={handleStartLanding} />;
  if (currentStep === "type") return <ChooseType onSelectType={handleSelectType} />;
  if (currentStep === "create") {
    return (
      <CreatePiggy
        setPiggy={handleCreateComplete}
        piggyType={selectedType}
        lockedFamilyRole={lockedFamilyRole}
        setGlobalRole={setLockedFamilyRole}
      />
    );
  }

  const activePiggy = activePiggyIndex !== null ? piggies[activePiggyIndex] : null;

  return (
    <div className="desktop-environment">

      {/* 🖥️ DESKTOP SHORTCUTS */}
      <div className="icons">
        <div
          className={`icon ${desktopWindow === "my-piggy-list" ? "active-shortcut" : ""}`}
          onClick={() => setDesktopWindow("my-piggy-list")}
        >
          <img src={pigicon} alt="My Piggy" className="desktop-icon-img" />
          <span>My Piggy</span>
        </div>

        <div
          className={`icon ${desktopWindow === "passbook" ? "active-shortcut" : ""}`}
          onClick={() => setDesktopWindow("passbook")}
        >
          <img src={passbookicon} alt="Passbook" className="desktop-icon-img" />
          <span>Passbook</span>
        </div>

        <div
          className={`icon ${desktopWindow === "letters" ? "active-shortcut" : ""}`}
          onClick={() => setDesktopWindow("letters")}
        >
          <img src={lettericon} alt="Letters" className="desktop-icon-img" />
          <span>Letters</span>
        </div>

        {/* Wallet Monitor */}
        <div className="wallet-monitor">
          👛 Wallet:<br />₹{globalWallet}
        </div>
      </div>

      {/* 🎛️ DASHBOARD VIEW */}
      {desktopWindow === "desktop" && activePiggy && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">{activePiggy.name}.exe</span>
            <div className="titlebar-controls" onClick={() => setDesktopWindow("my-piggy-list")}>×</div>
          </div>
          <div className="window-body-content">
            <Dashboard
              piggy={activePiggy}
              globalRole={lockedFamilyRole}
              piggyType={selectedType}
              onUpdatePiggy={(updatedData) => {
                const updatedList = [...piggies];
                updatedList[activePiggyIndex] = updatedData;
                setPiggies(updatedList);
              }}
            />
          </div>
        </div>
      )}

      {/* 🐷 MY PIGGY LIST WINDOW */}
      {desktopWindow === "my-piggy-list" && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">MyPiggyList.exe</span>
            <div className="titlebar-controls" onClick={() => setDesktopWindow("desktop")}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Active Passbooks</h1>
            <div className="popup-list-container">
              {piggies.length === 0 && (
                <p className="empty-notice">No active saving workspaces.</p>
              )}
              {piggies.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePiggyIndex(idx);
                    setSelectedType(p.type);
                    setDesktopWindow("desktop");
                  }}
                  className="popup-list-btn"
                >
                  🐷 {p.name} ({p.type}) — ₹{p.savedAmount} / ₹{p.goal}
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button onClick={handleGoBackToType} className="popup-primary-btn">➕ Create New Goal</button>
              <button onClick={() => setDesktopWindow("desktop")} className="popup-secondary-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 📒 PASSBOOK LOG WINDOW */}
      {desktopWindow === "passbook" && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">PassbookLogs.sys</span>
            <div className="titlebar-controls" onClick={() => setDesktopWindow("desktop")}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Transaction Passbook</h1>
            <div className="popup-list-container">
              {(!activePiggy || !activePiggy.logs || activePiggy.logs.length === 0) ? (
                <p className="empty-notice">No transactions logged yet.</p>
              ) : (
                activePiggy.logs.map((log, i) => (
                  <div key={i} className="ledger-log-row">
                    <strong>[{log.timestamp}]</strong>{" "}
                    <span className="user-tag">{log.user}:</span>{" "}
                    {log.type === "deposit" ? "🪙 Added" : "🔓 Requested"}{" "}
                    <span className="pink-text">₹{log.amount}</span>
                    {log.note && <p className="log-note-text">💬 Note: "{log.note}"</p>}
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setDesktopWindow("desktop")} className="popup-close-block-btn">
              Back to Desktop
            </button>
          </div>
        </div>
      )}

      {/* ✉️ AI LETTERS WINDOW */}
      {desktopWindow === "letters" && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">AI_Letters.txt</span>
            <div className="titlebar-controls" onClick={() => setDesktopWindow("desktop")}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Story Insights</h1>
            {activePiggy ? (
              <div className="ai-letter-body">
                <p><strong>To: The Saver of {activePiggy.name} 🐷</strong></p>
                <p style={{ marginTop: "12px" }}>
                  Oink! Your current progress is sitting at{" "}
                  <span style={{ color: "#d6005c", fontWeight: 900 }}>
                    {((activePiggy.savedAmount / activePiggy.goal) * 100).toFixed(1)}%
                  </span>.{" "}
                  {activePiggy.savedAmount === 0
                    ? "My belly is empty and cold! Drop some coins down the hatch so I can stretch my wings!"
                    : "The passbook scales are ticking! Keep feeding this goal pace to guarantee a successful harvest."}
                </p>
              </div>
            ) : (
              <p className="empty-notice">Connect a workspace profile to generate letters.</p>
            )}
            <button onClick={() => setDesktopWindow("desktop")} className="popup-close-block-btn" style={{ marginTop: "16px" }}>
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ TASKBAR */}
      <div className="system-taskbar-wrapper">
        <img src={taskbarImg} alt="System Taskbar" className="taskbar-background-image" />
      </div>

    </div>
  );
}

export default App;