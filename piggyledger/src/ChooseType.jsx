import "./ChooseType.css";
import soloImage from "./assets/download (6).png";    
import familyImage from "./assets/download (7).jpg";  
import friendsImage from "./assets/friends.png"; 

function ChooseType({ onSelectType }) {
  return (
    <div className="type-page">
      <div className="selection-window">
        <h1>Choose Your Piggy Type</h1>
        <p>How are you saving today?</p>

        <div className="cards">
          {/* Solo Card Option */}
          <div className="card" onClick={() => onSelectType("Solo")}>
            <img src={soloImage} alt="Solo Saving" className="card-image" />
            <h2>Solo</h2>
            <p>Save for yourself and track your personal goals.</p>
          </div>

          {/* Family Card Option */}
          <div className="card" onClick={() => onSelectType("Family")}>
            <img src={familyImage} alt="Family Saving" className="card-image" />
            <h2>Family</h2>
            <p>Save together with family members.</p>
          </div>

          {/* Friends Card Option */}
          <div className="card" onClick={() => onSelectType("Friends")}>
            <img src={friendsImage} alt="Friends Saving" className="card-image" />
            <h2>Friends</h2>
            <p>Trips, gifts and shared goals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseType;