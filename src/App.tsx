import React from "react";
import Game from "./components/Game";

const App: React.FC = () => {
  return (
    // This div ensures the game takes up the full viewport and handles overflow properly
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <Game />
    </div>
  );
};

export default App;
