import { useState } from "react";

import CreatePiggy from "./CreatePiggy";
import Dashboard from "./Dashboard";

function App() {

  const [piggy, setPiggy] = useState(null);

  return (
    <>
      {!piggy ? (
        <CreatePiggy setPiggy={setPiggy} />
      ) : (
        <Dashboard piggy={piggy} />
      )}
    </>
  );
}

export default App;