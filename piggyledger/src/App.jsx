import { useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
import ChooseType from "./ChooseType";
import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";
import { useSound } from "./useSound";

// Import custom icon assets
import pigicon from "./assets/pigicon.png";
import passbookicon from "./assets/passbookicon.png";
import lettericon from "./assets/lettericon.png";
import taskbarImg from "./assets/taskbar.jpeg";

function App() {
  const { playClick } = useSound();
  
  const withSound = (action) => (...args) => {
    playClick();
    action(...args);
  };

  const [currentStep, setCurrentStep] = useState("landing");
  const [piggies, setPiggies] = useState([]);
  const [activePiggyIndex, setActivePiggyIndex] = useState(null);
  const [globalWallet, setGlobalWallet] = useState(1000); 
  
  // 👑 Global Onboarding Role State: Starts null, prompts user when needed
  const [globalRole, setGlobalRole] = useState(null); 
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const [selectedType, setSelectedType] = useState("");
  const [desktopWindow, setDesktopWindow] = useState("desktop");

  const handleStartLanding = () => setCurrentStep("type");

  const handleSelectType = (type) => {
    setSelectedType(type);
    setCurrentStep("create");
  };

  const handleCreateComplete = (newPiggy) => {
    setPiggies([...piggies, newPiggy]);
    setActivePiggyIndex(piggies.length);
    setCurrentStep("dashboard");
    setDesktopWindow("desktop");
  };

  const handleGoBackToType = () => {
    setCurrentStep("type");
    setDesktopWindow("desktop");
  };

  // 🔥 Sane Wallet Influx Logic based on Identity Profile
  const handleAddWalletFunds = () => {
    if (!globalRole) {
      // Trigger modal if role isn't known yet
      setShowRoleModal(true);
      return;
    }
    
    if (globalRole === "child") {
      alert("🔒 Access Denied!\nChildren cannot inject funds directly. Parent authentication or approval required.");
      return;
    }

    setGlobalWallet(globalWallet + 500);
  };

  const selectInitialRole = (role) => {
    setGlobalRole(role);
    setShowRoleModal(false);
    if (role === "parent") {
      setGlobalWallet(globalWallet + 500); // Process the +500 reward for adults
    } else {
      alert("🧸 Welcome! As a Child profile, your wallet features are restricted until authorized by a parent.");
    }
  };

  if (currentStep === "landing") return <LandingPage onStart={withSound(handleStartLanding)} />;
  if (currentStep === "type") return <ChooseType onSelectType={withSound(handleSelectType)} />;
  if (currentStep === "create") {
    return (
      <CreatePiggy
        setPiggy={handleCreateComplete}
        piggyType={selectedType}
        globalRole={globalRole}
        setGlobalRole={setGlobalRole}
      />
    );
  }

  const activePiggy = activePiggyIndex !== null ? piggies[activePiggyIndex] : null;

  return (
    <div className="desktop-environment">
      {/* 🖥️ DESKTOP SHORTCUTS */}
      <div className="icons">
        <div className={`icon ${desktopWindow === "my-piggy-list" ? "active-shortcut" : ""}`} onClick={withSound(() => setDesktopWindow("my-piggy-list"))}>
          <img src={pigicon} alt="My Piggy" className="desktop-icon-img" />
          <span>My Piggy</span>
        </div>
        <div className={`icon ${desktopWindow === "passbook" ? "active-shortcut" : ""}`} onClick={withSound(() => setDesktopWindow("passbook"))}>
          <img src={passbookicon} alt="Passbook" className="desktop-icon-img" />
          <span>Passbook</span>
        </div>
        <div className={`icon ${desktopWindow === "letters" ? "active-shortcut" : ""}`} onClick={withSound(() => setDesktopWindow("letters"))}>
          <img src={lettericon} alt="Letters" className="desktop-icon-img" />
          <span>Letters</span>
        </div>
      </div>

      {/* Dynamic Smart Wallet Monitor Panel */}
      <div className="wallet-monitor">
        👛 Wallet
        <br />
        ₹{globalWallet}
        <button
          className="wallet-add-btn"
          onClick={withSound(handleAddWalletFunds)}
          style={{ display: "block", marginTop: "5px" }}
        >
          {globalRole === "child" ? "🔒 Locked" : "+ ₹500"}
        </button>
        {globalRole && (
          <span style={{ fontSize: "0.9rem", opacity: 0.8, display: "block", marginTop: "3px" }}>
            Profile: {globalRole === "parent" ? "Adult 👑" : "Child 🧸"}
          </span>
        )}
      </div>

      {/* 🚨 DYNAMIC RETRO ONBOARDING ROLE MODAL BOX */}
      {showRoleModal && (
        <div className="retro-modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="retro-window-popup window-entry-bounce" style={{ position: "static", width: "360px", transform: "none" }}>
            <div className="window-titlebar">
              <span className="titlebar-text">SecurityCheckpoint.exe</span>
              <div className="titlebar-controls" onClick={() => setShowRoleModal(false)}>×</div>
            </div>
            <div className="window-body-content" style={{ textAlign: "center", padding: "20px" }}>
              <h2 style={{ fontSize: "1.8rem", margin: "0 0 10px 0" }}>Who Are You?</h2>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Identify your framework workspace clearance role to process funds injection:</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="popup-primary-btn" style={{ flex: 1, padding: "12px" }} onClick={() => selectInitialRole("parent")}>Adult 👑</button>
                <button className="popup-secondary-btn" style={{ flex: 1, padding: "12px", background: "#f1a7b4" }} onClick={() => selectInitialRole("child")}>Child 🧸</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎛️ DASHBOARD VIEW */}
      {desktopWindow === "desktop" && activePiggy && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">{activePiggy.name}.exe</span>
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("my-piggy-list"))}>×</div>
          </div>
          <div className="window-body-content">
            <Dashboard
              piggy={activePiggy}
              globalRole={globalRole}
              piggyType={selectedType}
              globalWallet={globalWallet}
              setGlobalWallet={setGlobalWallet}
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
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("desktop"))}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Active Passbooks</h1>
            <div className="popup-list-container">
              {piggies.length === 0 && <p className="empty-notice">No active saving workspaces.</p>}
              {piggies.map((p, idx) => (
                <button key={idx} onClick={withSound(() => { setActivePiggyIndex(idx); setSelectedType(p.type); setDesktopWindow("desktop"); })} className="popup-list-btn">
                  🐷 {p.name} ({p.type}) — ₹{p.savedAmount} / ₹{p.goal}
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button onClick={withSound(handleGoBackToType)} className="popup-primary-btn">➕ Create New Goal</button>
              <button onClick={withSound(() => setDesktopWindow("desktop"))} className="popup-secondary-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 📒 PASSBOOK LOG WINDOW */}
      {desktopWindow === "passbook" && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">PassbookLogs.sys</span>
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("desktop"))}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Transaction Passbook</h1>
            {(!activePiggy || !activePiggy.logs || activePiggy.logs.length === 0) ? <p className="empty-notice">No transactions logged yet.</p> : activePiggy.logs.map((log, i) => (
              <div key={i} className="ledger-log-row"><strong>[{log.timestamp}]</strong> <span className="user-tag">{log.user}:</span> {log.type === "deposit" ? "🪙 Added" : "🔓 Requested"} <span className="pink-text">₹{log.amount}</span></div>
            ))}
            <button onClick={withSound(() => setDesktopWindow("desktop"))} className="popup-close-block-btn">Back to Desktop</button>
          </div>
        </div>
      )}

      {/* ✉️ AI LETTERS WINDOW */}
      {desktopWindow === "letters" && (
        <div className="retro-window-popup window-entry-bounce">
          <div className="window-titlebar">
            <span className="titlebar-text">AI_Letters.txt</span>
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("desktop"))}>×</div>
          </div>
          <div className="window-body-content">
            <h1>Story Insights</h1>
            {activePiggy ? <p>Oink! Your progress is at {((activePiggy.savedAmount / activePiggy.goal) * 100).toFixed(1)}%.</p> : <p className="empty-notice">Connect a workspace profile.</p>}
            <button onClick={withSound(() => setDesktopWindow("desktop"))} className="popup-close-block-btn">Close Window</button>
          </div>
        </div>
      )}

      <div className="system-taskbar-wrapper">
        <img src={taskbarImg} alt="System Taskbar" className="taskbar-background-image" />
      </div>
    </div>
  );
}

export default App;