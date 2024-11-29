import React from "react";
import { Trophy, Star, Target } from "lucide-react";
import type { GameState } from "../types/game";

interface ScoreBoardProps {
  teams: GameState["teams"];
  currentTeam: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teams, currentTeam }) => {
  // Helper function to calculate total questions answered by difficulty
  const getQuestionsStats = (team: GameState["teams"][string]) => {
    const { questionsAnswered } = team;
    const total =
      questionsAnswered.easy +
      questionsAnswered.medium +
      questionsAnswered.hard;

    return {
      total,
      easy: questionsAnswered.easy,
      medium: questionsAnswered.medium,
      hard: questionsAnswered.hard,
    };
  };

  const renderTeamScore = (
    teamId: string,
    team: GameState["teams"][string]
  ) => {
    const stats = getQuestionsStats(team);
    const isCurrentTeam = teamId === currentTeam;

    return (
      <div
        className={`
        bg-white/10 backdrop-blur-lg rounded-2xl p-6
        ${isCurrentTeam ? "ring-2 ring-purple-400 shadow-neon" : ""}
        transition-all duration-300
        animate-bounce-in
      `}
      >
        {/* Team Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-3xl font-bold text-purple-200">{team.name}</h3>
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-400" size={24} />
            <span className="text-4xl font-bold tabular-nums">
              {team.score}
            </span>
          </div>
        </div>
        {/* Questions Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-green-400" size={20} />
            </div>
            <div className="text-xl font-medium">Fácil</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.easy}
            </div>
          </div>

          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-yellow-400" size={20} />
            </div>
            <div className="text-xl font-medium">Medio</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.medium}
            </div>
          </div>

          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-red-400" size={20} />
            </div>
            <div className="text-xl font-medium">Difícil</div>
            <div className="text-2xl font-bold text-red-400">{stats.hard}</div>
          </div>
        </div>
        {/* Total Questions */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2">
            <Target className="text-purple-400" size={20} />
            <span className="text-xl">Total Preguntas:</span>
            <span className="text-2xl font-bold text-purple-400">
              {stats.total}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
      {Object.entries(teams).map(([teamId, team]) => (
        <div key={teamId} className="animate-fade-in">
          {renderTeamScore(teamId, team)}
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
