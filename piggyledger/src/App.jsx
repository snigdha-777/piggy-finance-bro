import { useState } from "react";
import LandingPage from "./LandingPage";
import ChooseType from "./ChooseType";
import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";

function App() {
  const [currentStep, setCurrentStep] = useState("landing");
  
  const [piggy, setPiggy] = useState({
    name: "",
    goal: 100,
    type: "",
    date: "",
    members: []
  });

  // Navigation handlers
  const handleStartLanding = () => setCurrentStep("type");
  
  const handleSelectType = (selectedType) => {
    setPiggy((prev) => ({ ...prev, type: selectedType }));
    setCurrentStep("create");
  };

  const handleCreateComplete = (configuredPiggy) => {
    setPiggy((prev) => ({
      ...prev,
      ...configuredPiggy
    }));
    setCurrentStep("dashboard");
  };

  switch (currentStep) {
    case "landing":
      return <LandingPage onStart={handleStartLanding} />;
    case "type":
      return <ChooseType onSelectType={handleSelectType} />;
    case "create":
      return <CreatePiggy setPiggy={handleCreateComplete} piggyType={piggy.type} />;
    case "dashboard":
      return <Dashboard piggy={piggy} />;
    default:
      return <LandingPage onStart={handleStartLanding} />;
  }
}

export default App;