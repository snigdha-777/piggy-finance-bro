import "./ChooseType.css";

function ChooseType() {
  return (
    <div className="type-page">

      <div className="selection-window">

        <h1>Choose Your Piggy Type</h1>

        <p>
          How are you saving today?
        </p>

        <div className="cards">

          <div className="card">
            <div className="emoji">👤</div>

            <h2>Solo</h2>

            <p>
              Save for yourself and track
              your personal goals.
            </p>
          </div>

          <div className="card">
            <div className="emoji">👨‍👩‍👧</div>

            <h2>Family</h2>

            <p>
              Save together with family
              members.
            </p>
          </div>

          <div className="card">
            <div className="emoji">👫</div>

            <h2>Friends</h2>

            <p>
              Trips, gifts and shared goals.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ChooseType;