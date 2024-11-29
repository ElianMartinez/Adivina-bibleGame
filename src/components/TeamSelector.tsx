import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Trophy } from "lucide-react";
import type { GameState } from "../types/game";

interface TeamSelectorProps {
  teams: GameState["teams"];
  onStartGame: (firstTeam: "team1" | "team2") => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, onStartGame }) => {
  const [selectedTeam, setSelectedTeam] = React.useState<
    "team1" | "team2" | null
  >(null);

  // Animaciones para los elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 
                 text-white p-8 flex items-center justify-center"
    >
      <div className="max-w-4xl w-full">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1
            className="text-6xl font-bold mb-4 bg-clip-text text-transparent 
                       bg-gradient-to-r from-purple-400 to-pink-300"
          >
            ¿Quién comienza?
          </h1>
          <div className="flex justify-center space-x-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <Users className="w-12 h-12 text-purple-300" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          {(["team1", "team2"] as const).map((teamId) => (
            <motion.button
              key={teamId}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTeam(teamId)}
              className={`
                p-8 rounded-2xl backdrop-blur-sm transition-all duration-300
                ${
                  selectedTeam === teamId
                    ? "bg-purple-500/30 ring-2 ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    : "bg-white/10 hover:bg-white/20"
                }
              `}
            >
              <div className="text-4xl font-bold mb-4">
                {teams[teamId].name}
              </div>
              <div className="text-purple-200 text-xl">
                ¡Listo para comenzar!
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectedTeam && onStartGame(selectedTeam)}
            disabled={!selectedTeam}
            className={`
              px-12 py-6 text-3xl rounded-xl font-bold
              flex items-center space-x-4
              transition-all duration-300
              ${
                selectedTeam
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  : "bg-gray-600/50 cursor-not-allowed"
              }
            `}
          >
            <span>Iniciar Juego</span>
            <ArrowRight className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeamSelector;
