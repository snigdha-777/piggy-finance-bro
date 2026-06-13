import { useEffect, useState } from "react";
import "./LandingPage.css";
import pigGif from "./assets/pig.gif";

// Import your custom desktop image assets
import pigicon from "./assets/pigicon.png";
import passbookicon from "./assets/passbookicon.png";
import lettericon from "./assets/lettericon.png";
import taskbarImg from "./assets/taskbar.jpeg"; 

function LandingPage({ onStart }) {
  const [showDesktop, setShowDesktop] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Feeding Pig...",
    "Counting Coins...",
    "Polishing Passbook...",
    "Preparing Letters...",
    "Launching PiggyLedger..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    const timer = setTimeout(() => {
      setShowDesktop(true);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [messages.length]);

  return (
    <>
      {/* INTRO BOOT SCREEN */}
      <div className={`intro ${showDesktop ? "fade-out" : ""}`}>
        <img
          src={pigGif}
          alt="Flying Pig"
          className="intro-pig"
        />
        <h1>PiggyLedger OS</h1>
        <p>{messages[messageIndex]}</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((messageIndex + 1) / messages.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* DESKTOP ENVIRONMENT */}
      <div className={`desktop ${showDesktop ? "show" : ""}`}>
        <div className="icons">
          <div className="icon">
            <img src={pigicon} alt="My Piggy" className="desktop-icon-img" />
            <span>My Piggy</span>
          </div>
          <div className="icon">
            <img src={passbookicon} alt="Passbook" className="desktop-icon-img" />
            <span>Passbook</span>
          </div>
          <div className="icon">
            <img src={lettericon} alt="Letters" className="desktop-icon-img" />
            <span>Letters</span>
          </div>
        </div>

        <div className="window">
          <div className="titlebar">
            PiggyLedger.exe
          </div>
          <div className="window-content">
            <h1>Turn Saving Into A Story</h1>
            <p>Save together. Grow together.</p>
            
            <button type="button" onClick={onStart}>
              Start Saving
            </button>
          </div>
        </div>

        {/* 🖥️ SYSTEM TASKBAR - IMAGE ONLY */}
        <div className="system-taskbar-wrapper">
          <img src={taskbarImg} alt="System Taskbar" className="taskbar-background-image" />
        </div>
      </div>
    </>
  );
}

export default LandingPage;