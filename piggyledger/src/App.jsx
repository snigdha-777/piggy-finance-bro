import { useState } from "react";
import LandingPage from "./LandingPage";
import ChooseType from "./ChooseType";
import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";

// Import your custom icon assets
import pigicon from "./assets/pigicon.png";
import passbookicon from "./assets/passbookicon.png";
import lettericon from "./assets/lettericon.png";
import taskbarImg from "./assets/taskbar.jpeg"; // Blended custom taskbar asset

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
    setPiggies([...piggies, { ...newPiggy, savedAmount: 0, logs: [] }]);
    setActivePiggyIndex(piggies.length); 
    setCurrentStep("dashboard");
    setDesktopWindow("desktop");
  };

  const handleGoBackToType = () => {
    setCurrentStep("type");
    setDesktopWindow("desktop");
  };

  if (currentStep === "landing") {
    return <LandingPage onStart={handleStartLanding} />;
  }

  if (currentStep === "type") {
    return <ChooseType onSelectType={handleSelectType} />;
  }

  if (currentStep === "create") {
    return (
      <CreatePiggy 
        setPiggy={handleCreateComplete} 
        piggyType={selectedType} 
        lockedFamilyRole={lockedFamilyRole}
      />
    );
  }

  return (
    <div className="desktop-environment">
      
      {/* 🖥️ DESKTOP SHORTCUTS WITH CUSTOM IMAGES */}
      <div className="icons">
        <div className="icon" onClick={() => setDesktopWindow("my-piggy-list")}>
          <img src={pigicon} alt="My Piggy" className="desktop-icon-img" />
          <span>My Piggy</span>
        </div>
        <div className="icon" onClick={() => setDesktopWindow("passbook")}>
          <img src={passbookicon} alt="Passbook" className="desktop-icon-img" />
          <span>Passbook</span>
        </div>
        <div className="icon" onClick={() => setDesktopWindow("letters")}>
          <img src={lettericon} alt="Letters" className="desktop-icon-img" />
          <span>Letters</span>
        </div>
        
        {/* Wallet Display Monitor */}
        <div className="wallet-monitor">
          👛 Wallet:<br/>₹{globalWallet}
        </div>
      </div>

      {/* 🎛️ CORES VIEW WINDOW CONTAINER */}
      {desktopWindow === "desktop" && activePiggyIndex !== null && (
        <Dashboard 
          piggy={piggies[activePiggyIndex]} 
          globalRole={lockedFamilyRole}
          piggyType={selectedType}
          onUpdatePiggy={(updatedData) => {
            const updatedList = [...piggies];
            updatedList[activePiggyIndex] = updatedData;
            setPiggies(updatedList);
          }}
          onWithdrawToWallet={(amount) => {
            setGlobalWallet(prev => prev + amount);
          }}
        />
      )}

      {/* 🐷 APP WINDOW: My Piggy Directory */}
      {desktopWindow === "my-piggy-list" && (
        <div className="retro-window-popup">
          <h2>Active Passbooks</h2>
          <div className="popup-list-container">
            {piggies.map((p, idx) => (
              <button key={idx} onClick={() => { setActivePiggyIndex(idx); setSelectedType(p.type); setDesktopWindow("desktop"); }} className="popup-list-btn">
                🎯 {p.name} ({p.type}) — ₹{p.savedAmount}/₹{p.goal}
              </button>
            ))}
          </div>
          <div className="popup-actions">
            <button onClick={handleGoBackToType} className="popup-primary-btn">➕ Create New Goal</button>
            <button onClick={() => setDesktopWindow("desktop")} className="popup-secondary-btn">Close</button>
          </div>
        </div>
      )}

      {/* 📒 APP WINDOW: Passbook Ledger Logs */}
      {desktopWindow === "passbook" && (
        <div className="retro-window-popup">
          <h2>Transaction Passbook</h2>
          <div className="popup-list-container italic-scroller">
            {activePiggyIndex !== null && piggies[activePiggyIndex]?.logs.length === 0 && <p className="empty-notice">No transactions logged yet.</p>}
            {activePiggyIndex !== null && piggies[activePiggyIndex]?.logs.map((log, i) => (
              <div key={i} className="ledger-log-row">
                <strong>[{log.timestamp}]</strong> {log.type === 'deposit' ? '🪙 Added' : '🔓 Requested'} <span className="pink-text">₹{log.amount}</span>
                {log.note && <p className="log-note-text">💬 Note: "{log.note}"</p>}
              </div>
            ))}
          </div>
          <button onClick={() => setDesktopWindow("desktop")} className="popup-close-block-btn">Back to Desktop</button>
        </div>
      )}

      {/* ✉️ APP WINDOW: Monthly AI Report */}
      {desktopWindow === "letters" && (
        <div className="retro-window-popup">
          <h2>AI Story Passbook Insights</h2>
          {activePiggyIndex !== null && (
            <div className="ai-letter-body">
              <p><strong>To: The Saver of {piggies[activePiggyIndex].name} 🐷</strong></p>
              <p style={{ marginTop: "10px" }}>
                Oink! I noticed your current progress is sitting at {((piggies[activePiggyIndex].savedAmount / piggies[activePiggyIndex].goal) * 100).toFixed(1)}%. 
                {piggies[activePiggyIndex].savedAmount === 0 ? " My belly is empty and cold! Drop some coins down the hatch so I can stretch my wings!" : " The passbook scales are ticking! Keep feeding this goal pace to guarantee a successful harvest."}
              </p>
            </div>
          )}
          <button onClick={() => setDesktopWindow("desktop")} className="popup-close-block-btn" style={{ marginTop: "15px" }}>Close Window</button>
        </div>
      )}

      {/* 🖥️ SYSTEM TASKBAR - CLEAN IMAGE-ONLY IMPLEMENTATION */}
      <div className="system-taskbar-wrapper">
        <img src={taskbarImg} alt="System Taskbar" className="taskbar-background-image" />
      </div>

    </div>
  );
}

export default App;