// src/RetroWindow.jsx
import React from "react";

function RetroWindow({ title, onClose, children }) {
  return (
    <div className="retro-window-popup window-entry-bounce">
      <div className="window-titlebar">
        <span className="titlebar-text">{title}</span>
        <div className="titlebar-controls" onClick={onClose}>×</div>
      </div>
      <div className="window-body-content">
        {children}
      </div>
    </div>
  );
}

export default RetroWindow;