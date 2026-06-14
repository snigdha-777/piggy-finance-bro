import { useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
import ChooseType from "./ChooseType";
import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";
import { useSound } from "./useSound";

// 🌐 FIXED: Static imports moved to the top to stop dynamic routing errors
import { fetchPiggyLetter, askPiggyAnything } from "./aiService";

// Import custom icon assets
import pigicon from "./assets/pigicon.png";
import passbookicon from "./assets/passbookicon.png";
import lettericon from "./assets/lettericon.png";
import taskbarImg from "./assets/taskbar.jpeg";

function App() {
  const { playClick } = useSound();
  
  const withSound = (action) => (...args) => {
    if (typeof playClick === "function") playClick();
    action(...args);
  };

  const [currentStep, setCurrentStep] = useState("landing");
  const [piggies, setPiggies] = useState([]);
  const [activePiggyIndex, setActivePiggyIndex] = useState(null);
  const [globalWallet, setGlobalWallet] = useState(1000); 
  
  const [globalRole, setGlobalRole] = useState(null); 
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const [selectedType, setSelectedType] = useState("");
  const [desktopWindow, setDesktopWindow] = useState("desktop");

  // New states for the physical letter animation modal
  const [letterContent, setLetterContent] = useState("");
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // New states for Piggy Chat logs per piggy instance
  const [chatInput, setChatInput] = useState("");
  const [isChatThinking, setIsChatThinking] = useState(false);

  const handleStartLanding = () => setCurrentStep("type");

  const handleSelectType = (type) => {
    setSelectedType(type);
    setCurrentStep("create");
  };

  const handleCreateComplete = (newPiggy) => {
    setPiggies([...piggies, { ...newPiggy, chatHistory: [] }]);
    setActivePiggyIndex(piggies.length);
    setCurrentStep("dashboard");
    setDesktopWindow("desktop");
  };

  const handleGoBackToType = () => {
    setCurrentStep("type");
    setDesktopWindow("desktop");
  };

  const handleAddWalletFunds = () => {
    if (!globalRole) {
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
      setGlobalWallet(globalWallet + 500);
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
        playClick={playClick}
      />
    );
  }

  const activePiggy = activePiggyIndex !== null ? piggies[activePiggyIndex] : null;

  // Handler for standalone chat window triggers
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !activePiggy) return;
    if (typeof playClick === "function") playClick();

    const userMessage = chatInput.trim();
    setChatInput("");
    setIsChatThinking(true);

    // 1. Instantly append the user's message using functional state updates
    setPiggies((prevPiggies) => {
      const copy = [...prevPiggies];
      const target = { ...copy[activePiggyIndex] };
      target.chatHistory = [...(target.chatHistory || []), { sender: "user", text: userMessage }];
      copy[activePiggyIndex] = target;
      return copy;
    });

    try {
      // 🌐 FIXED: Removed dynamic import block
      const answer = await askPiggyAnything(piggies[activePiggyIndex], userMessage);
      
      // 2. Append Piggy's reply using functional state updates
      setPiggies((prevPiggies) => {
        const copy = [...prevPiggies];
        const target = { ...copy[activePiggyIndex] };
        target.chatHistory = [...(target.chatHistory || []), { sender: "piggy", text: answer }];
        copy[activePiggyIndex] = target;
        return copy;
      });
    } catch (err) {
      console.error("AI Communication Error:", err);
      
      // Fallback message update on failure
      setPiggies((prevPiggies) => {
        const copy = [...prevPiggies];
        const target = { ...copy[activePiggyIndex] };
        target.chatHistory = [...(target.chatHistory || []), { sender: "piggy", text: "Oink! Connection lost. Try again! 🔌" }];
        copy[activePiggyIndex] = target;
        return copy;
      });
    } finally {
      setIsChatThinking(false);
    }
  };

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

      {/* Wallet Monitor Panel */}
      <div className="wallet-monitor">
        👛 Wallet
        <br />
        ₹{globalWallet}
        <button className="wallet-add-btn" onClick={withSound(handleAddWalletFunds)} style={{ display: "block", marginTop: "5px" }}>
          {globalRole === "child" ? "🔒 Locked" : "+ ₹500"}
        </button>
        {globalRole && (
          <span style={{ fontSize: "0.9rem", opacity: 0.8, display: "block", marginTop: "3px" }}>
            Profile: {globalRole === "parent" ? "Adult 👑" : "Child 🧸"}
          </span>
        )}
      </div>

      {/* ROLE MODAL BOX */}
      {showRoleModal && (
        <div className="retro-modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="retro-window-popup window-entry-bounce" style={{ position: "static", width: "360px", transform: "none" }}>
            <div className="window-titlebar">
              <span className="titlebar-text">SecurityCheckpoint.exe</span>
              <div className="titlebar-controls" onClick={() => setShowRoleModal(false)}>×</div>
            </div>
            <div className="window-body-content" style={{ textAlign: "center", padding: "20px" }}>
              <h2 style={{ fontSize: "1.8rem", margin: "0 0 10px 0" }}>Who Are You?</h2>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Identify your identity profile role to process funds:</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="popup-primary-btn" style={{ flex: 1, padding: "12px" }} onClick={withSound(() => selectInitialRole("parent"))}>Adult 👑</button>
                <button className="popup-secondary-btn" style={{ flex: 1, padding: "12px", background: "#f1a7b4" }} onClick={withSound(() => selectInitialRole("child"))}>Child 🧸</button>
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
              globalWallet={globalWallet}
              setGlobalWallet={setGlobalWallet}
              playClick={playClick}
              onOpenLettersWindow={() => setDesktopWindow("letters")}
              onOpenChatWindow={() => setDesktopWindow("piggy-chat")}
              onUpdatePiggy={(updatedData) => {
                const updatedList = [...piggies];
                updatedList[activePiggyIndex] = updatedData;
                setPiggies(updatedList);
              }}
            />
          </div>
        </div>
      )}

      {/* MY PIGGY LIST WINDOW */}
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
            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>📒 Select Passbook Account Sheet:</label>
              <select style={{ width: "100%", padding: "6px", border: "2px solid #1e1e1e", borderRadius: "4px" }} value={activePiggyIndex !== null ? activePiggyIndex : ""} onChange={(e) => setActivePiggyIndex(Number(e.target.value))}>
                {piggies.map((p, idx) => <option key={idx} value={idx}>🐷 {p.name} ({p.type})</option>)}
              </select>
            </div>
            {(!activePiggy || !activePiggy.logs || activePiggy.logs.length === 0) ? (
              <p className="empty-notice">No transactions logged yet.</p>
            ) : (
              <div style={{ maxHeight: "220px", overflowY: "auto", textAlign: "left", background: "#fff", border: "2px solid #1e1e1e", padding: "8px", borderRadius: "6px" }}>
                {activePiggy.logs.map((log, i) => (
                  <div key={i} className="ledger-log-row" style={{ borderBottom: "1px dashed #ccc", padding: "6px 0" }}>
                    <strong>[{log.timestamp}]</strong> <span className="user-tag" style={{ color: "#ff8fa3", fontWeight: "bold" }}>{log.user}:</span>{" "}
                    {log.type === "deposit" ? "🪙 Added" : "🔓 Requested"}{" "}
                    <span className="pink-text" style={{ fontWeight: "bold" }}>₹{log.amount}</span>
                    <div style={{ fontStyle: "italic", fontSize: "0.85rem", opacity: 0.7, marginLeft: "12px" }}>↳ "{log.note || "No memo note"}"</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={withSound(() => setDesktopWindow("desktop"))} className="popup-close-block-btn" style={{ marginTop: "12px" }}>Back to Desktop</button>
          </div>
        </div>
      )}

      {/* ✉️ AI LETTERS MAILBOX WINDOW */}
      {desktopWindow === "letters" && (
        <div className={`retro-window-popup window-entry-bounce ${isLetterOpen || isGeneratingLetter ? "mailbox-darkened" : ""}`}>
          <div className="window-titlebar">
            <span className="titlebar-text">AI_Letters.txt</span>
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("desktop"))}>×</div>
          </div>
          <div className="window-body-content" style={{ background: "#fcf8f2" }}>
            <h1 style={{ margin: "0 0 5px 0" }}>📬 Post Office Mailbox</h1>
            <p style={{ fontSize: "0.9rem", margin: "0 0 15px 0", opacity: 0.8 }}>Choose a target workspace profile from the directory to dispatch operations:</p>

            {piggies.length === 0 ? (
              <p className="empty-notice">No active saving targets found. Create a workspace piggy first!</p>
            ) : (
              <div>
                <div style={{ textAlign: "left", marginBottom: "15px", background: "#fff", padding: "10px", border: "2px solid #1e1e1e", borderRadius: "8px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>🎯 Target Goal File Registry:</label>
                  <select
                    style={{ width: "100%", padding: "8px", border: "2px solid #1e1e1e", borderRadius: "4px" }}
                    value={activePiggyIndex !== null ? activePiggyIndex : 0}
                    onChange={(e) => setActivePiggyIndex(Number(e.target.value))}
                  >
                    <optgroup label="⏳ Ongoing Goals">
                      {piggies.map((p, idx) => (p.savedAmount || 0) < p.goal ? (
                        <option key={idx} value={idx}>⏳ {p.name} ({Math.round(((p.savedAmount || 0) / p.goal) * 100)}%)</option>
                      ) : null)}
                    </optgroup>
                    <optgroup label="🎉 Completed Goals">
                      {piggies.map((p, idx) => (p.savedAmount || 0) >= p.goal ? (
                        <option key={idx} value={idx}>🏆 {p.name} (100% Smashed!)</option>
                      ) : null)}
                    </optgroup>
                  </select>
                </div>

                {/* 📬 Action Button 1: Generate Letter Summary */}
                <button 
                  className="popup-primary-btn"
                  style={{ width: "100%", padding: "12px", background: "#fbc02d", color: "#1e1e1e", fontWeight: "bold", marginBottom: "10px", cursor: "pointer", border: "2px solid #1e1e1e" }}
                  disabled={isGeneratingLetter}
                  onClick={withSound(async () => {
                    const selection = piggies[activePiggyIndex];
                    if (!selection) return;

                    setIsGeneratingLetter(true);
                    // 🌐 FIXED: Removed dynamic import block
                    const letterResult = await fetchPiggyLetter(selection);
                    
                    setLetterContent(letterResult);
                    setIsGeneratingLetter(false);
                    setIsLetterOpen(true);
                  })}
                >
                  {isGeneratingLetter ? "🕒 Sorting Secure Mailbags..." : `📬 Generate AI Progress Summary`}
                </button>

                {/* 💬 Action Button 2: Launch Messenger App Window */}
                <button 
                  className="popup-primary-btn"
                  style={{ width: "100%", padding: "12px", background: "#4caf50", color: "white", fontWeight: "bold", marginBottom: "15px", cursor: "pointer", border: "2px solid #1e1e1e" }}
                  onClick={withSound(() => setDesktopWindow("piggy-chat"))}
                >
                  💬 Ask Piggy (Open PiggyChat.txt)
                </button>
              </div>
            )}

            {/* FLYING PHYSICAL STATIONERY OVERLAY */}
            {isLetterOpen && (
              <div className="physical-mail-overlay">
                <div className="physical-letter-envelope letter-fly-and-unfold">
                  <div className="letter-header-stamp">📮</div>
                  <div className="physical-letter-paper-content">
                    {letterContent}
                  </div>
                  <button className="close-letter-btn" onClick={withSound(() => setIsLetterOpen(false))}>
                    [X Close Letter]
                  </button>
                </div>
              </div>
            )}

            <button onClick={withSound(() => setDesktopWindow("desktop"))} className="popup-close-block-btn" style={{ marginTop: "15px" }}>Close Window</button>
          </div>
        </div>
      )}

      {/* 💬 STANDALONE MESSENGER INTERFACE: PiggyChat.txt */}
      {desktopWindow === "piggy-chat" && activePiggy && (
        <div className="retro-window-popup window-entry-bounce" style={{ width: "380px" }}>
          <div className="window-titlebar">
            <span className="titlebar-text">PiggyChat.txt</span>
            <div className="titlebar-controls" onClick={withSound(() => setDesktopWindow("desktop"))}>×</div>
          </div>
          <div className="window-body-content" style={{ display: "flex", flexDirection: "column", height: "360px", background: "#fafafa", padding: "10px" }}>
            
            {/* Conversations stream log wrapper */}
            <div style={{ flex: 1, overflowY: "auto", border: "2px solid #1e1e1e", background: "#fff", padding: "8px", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.6, fontStyle: "italic", borderBottom: "1px dashed #ccc", paddingBottom: "4px" }}>
                Secure Chat Linked to: 🐷 {activePiggy.name}
              </div>
              
              {/* Fallback default message prompt */}
              {(!activePiggy.chatHistory || activePiggy.chatHistory.length === 0) && (
                <div style={{ background: "#fff0f3", border: "1px dashed #ff8fa3", padding: "8px", borderRadius: "6px", fontSize: "0.9rem" }}>
                  <strong>🐷 Piggy:</strong> Oink! Ask me anything about milestones, allocator leaderboards, or target estimations!
                </div>
              )}

              {activePiggy.chatHistory?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.sender === "user" ? "#e1f5fe" : "#fff0f3", border: msg.sender === "user" ? "1px solid #0288d1" : "1px solid #ff8fa3", borderRadius: "6px", padding: "8px", fontSize: "0.9rem" }}>
                  <strong>{msg.sender === "user" ? "👤 You:" : "🐷 Piggy:"}</strong>
                  <p style={{ margin: "4px 0 0 0", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{msg.text}</p>
                </div>
              ))}

              {isChatThinking && (
                <div style={{ alignSelf: "flex-start", background: "#fff0f3", border: "1px dashed #ff8fa3", padding: "8px", borderRadius: "6px", fontSize: "0.9rem", animation: "pulse 1.5s infinite" }}>
                  <strong>🐷 Piggy:</strong> Thinking... 🕒
                </div>
              )}
            </div>

            {/* Input interface block controls */}
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                placeholder="Type query console message..."
                value={chatInput}
                disabled={isChatThinking}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                style={{ flex: 1, padding: "8px", border: "2px solid #1e1e1e", borderRadius: "4px" }}
              />
              <button 
                onClick={handleSendChatMessage}
                disabled={isChatThinking}
                style={{ background: "#ff8fa3", border: "2px solid #1e1e1e", padding: "0 12px", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
              >
                Send
              </button>
            </div>
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