import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronRight, Sparkles, Crown } from "lucide-react";
import type { GameState } from "../types/game";

interface TeamSetupProps {
  onStartGame: (teams: GameState["teams"]) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onStartGame }) => {
  const [team1Name, setTeam1Name] = React.useState("");
  const [team2Name, setTeam2Name] = React.useState("");
  const [isStarting, setIsStarting] = React.useState(false);

  const handleStartGame = () => {
    if (!team1Name || !team2Name) {
      alert("Por favor ingresa los nombres de ambos equipos");
      return;
    }

    setIsStarting(true);

    // Pequeña demora para la animación
    setTimeout(() => {
      const teams: GameState["teams"] = {
        team1: {
          name: team1Name,
          score: 0,
          questionsAnswered: { easy: 0, medium: 0, hard: 0 },
        },
        team2: {
          name: team2Name,
          score: 0,
          questionsAnswered: { easy: 0, medium: 0, hard: 0 },
        },
      };
      onStartGame(teams);
    }, 800);
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const shine = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 100,
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={isStarting ? "exit" : "visible"}
        variants={{
          exit: {
            scale: 1.1,
            opacity: 0,
            transition: { duration: 0.5 },
          },
        }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 
                   text-white p-8 flex items-center justify-center overflow-hidden"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full mx-auto relative"
        >
          {/* Efectos de fondo */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 
                     rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 
                     rounded-full blur-3xl"
          />

          {/* Título principal */}
          <motion.div
            variants={titleVariants}
            className="text-center mb-16 relative"
          >
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <h1
                className="text-8xl font-bold mb-4 bg-clip-text text-transparent 
                         bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400"
              >
                Juego Bíblico
              </h1>
              <motion.div
                variants={shine}
                className="absolute inset-0 w-20 h-full bg-gradient-to-r 
                         from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center mt-8 space-x-4"
            >
              <Crown className="w-16 h-16 text-yellow-400" />
              <Users className="w-16 h-16 text-purple-300" />
              <Sparkles className="w-16 h-16 text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Formulario de equipos */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 
                     shadow-[0_0_50px_rgba(168,85,247,0.2)] relative
                     overflow-hidden"
          >
            {/* Efecto de brillo en el borde */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)",
                transform: "translateX(-50%)",
              }}
            />

            <motion.h2
              variants={itemVariants}
              className="text-5xl font-bold mb-12 text-center text-transparent
                       bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300"
            >
              Configurar Equipos
            </motion.h2>

            <div className="space-y-8">
              {/* Input Equipo 1 */}
              <motion.div variants={itemVariants} className="relative">
                <motion.label
                  whileHover={{ x: 5 }}
                  className="block text-3xl mb-3 text-purple-200 font-semibold"
                >
                  Equipo 1
                </motion.label>
                <motion.input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Nombre del Equipo 1"
                  whileFocus={{ scale: 1.02 }}
                  className="w-full p-6 text-4xl bg-white/20 rounded-xl
                           border-2 border-transparent focus:border-purple-400
                           focus:outline-none transition-all duration-300
                           placeholder-purple-300/50 shadow-lg"
                />
              </motion.div>

              {/* Input Equipo 2 */}
              <motion.div variants={itemVariants} className="relative">
                <motion.label
                  whileHover={{ x: 5 }}
                  className="block text-3xl mb-3 text-purple-200 font-semibold"
                >
                  Equipo 2
                </motion.label>
                <motion.input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Nombre del Equipo 2"
                  whileFocus={{ scale: 1.02 }}
                  className="w-full p-6 text-4xl bg-white/20 rounded-xl
                           border-2 border-transparent focus:border-purple-400
                           focus:outline-none transition-all duration-300
                           placeholder-purple-300/50 shadow-lg"
                />
              </motion.div>
            </div>

            {/* Botón de inicio */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              className="w-full mt-12 p-8 text-4xl relative overflow-hidden
                       bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 
                       rounded-xl transition-all duration-300
                       shadow-lg hover:shadow-purple-500/50
                       font-bold text-white group"
            >
              <motion.span className="relative z-10 flex items-center justify-center gap-4">
                Comenzar Juego
                <ChevronRight className="w-8 h-8" />
              </motion.span>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 
                         via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamSetup;
