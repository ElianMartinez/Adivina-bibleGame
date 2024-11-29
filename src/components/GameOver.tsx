import React, { useEffect } from "react";
import { Trophy, Crown, Medal, Star, RotateCcw, Home } from "lucide-react";
import { useGameSounds } from "../hooks/useGameSounds";
import type { GameState } from "../types/game";

interface GameOverProps {
  teams: GameState["teams"];
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ teams, onRestart, onHome }) => {
  const { playSound } = useGameSounds();

  // Calculate the winner and final scores
  const results = Object.entries(teams)
    .map(([id, team]) => ({
      id,
      ...team,
      totalQuestions: Object.values(team.questionsAnswered).reduce(
        (a, b) => a + b,
        0
      ),
    }))
    .sort((a, b) => b.score - a.score);

  //   const winner = results[0];
  const isDraw = results.length > 1 && results[0].score === results[1].score;

  // Play victory sound when component mounts
  useEffect(() => {
    playSound("success", 0.7);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Title with animation */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-4 animate-bounce-in bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-400">
            ¡Juego Terminado!
          </h1>

          {!isDraw && (
            <div className="flex justify-center animate-float">
              <Crown className="h-24 w-24 text-yellow-400" />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="grid gap-8 mb-12">
          {results.map((team, index) => (
            <div
              key={team.id}
              className={`
                bg-white/10 backdrop-blur-lg rounded-2xl p-6
                transform transition-all duration-500
                ${
                  index === 0 && !isDraw
                    ? "ring-2 ring-yellow-400 shadow-neon scale-105"
                    : ""
                }
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {index === 0 && !isDraw ? (
                    <Trophy className="h-10 w-10 text-yellow-400" />
                  ) : index === 1 ? (
                    <Medal className="h-10 w-10 text-gray-400" />
                  ) : (
                    <Star className="h-10 w-10 text-purple-400" />
                  )}
                  <h2 className="text-3xl font-bold">{team.name}</h2>
                </div>
                <div className="text-4xl font-bold tabular-nums">
                  {team.score} pts
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-green-400 text-xl mb-1">Fácil</div>
                  <div className="text-2xl font-bold">
                    {team.questionsAnswered.easy}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-yellow-400 text-xl mb-1">Medio</div>
                  <div className="text-2xl font-bold">
                    {team.questionsAnswered.medium}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-red-400 text-xl mb-1">Difícil</div>
                  <div className="text-2xl font-bold">
                    {team.questionsAnswered.hard}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            className="flex items-center space-x-2 px-8 py-4 bg-purple-600 
                     rounded-lg text-2xl hover:bg-purple-500 
                     transform transition-all duration-200
                     hover:scale-105 active:scale-95"
            onMouseEnter={() => playSound("hover")}
            onClick={() => {
              playSound("click");
              onRestart();
            }}
          >
            <RotateCcw className="h-6 w-6" />
            <span>Jugar de Nuevo</span>
          </button>

          <button
            className="flex items-center space-x-2 px-8 py-4 bg-white/10 
                     rounded-lg text-2xl hover:bg-white/20
                     transform transition-all duration-200
                     hover:scale-105 active:scale-95"
            onMouseEnter={() => playSound("hover")}
            onClick={() => {
              playSound("click");
              onHome();
            }}
          >
            <Home className="h-6 w-6" />
            <span>Inicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
