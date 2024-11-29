import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Loader2, Flag, ChartBar } from "lucide-react";
import TeamSetup from "./TeamSetup";
import TeamSelector from "./TeamSelector";
import QuestionCard from "./QuestionCard";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";
import AnswerModal from "./AnswerModal";
import GameOver from "./GameOver";
import { useGameLogic, GAME_CONFIG } from "../hooks/useGameLogic";

const Game: React.FC = () => {
  // Utilizamos el hook personalizado que maneja toda la lógica del juego
  // Ahora incluimos currentQuestionId que es esencial para el manejo correcto del timer
  const {
    gameState,
    isLoading,
    showModal,
    showScoreboard,
    selectedAnswer,
    currentQuestionId, // Importante para el Timer
    handleTeamSetup,
    handleTeamSelection,
    handleAnswerSelect,
    handleModalClose,
    handleTimeUp,
    endGame,
    toggleScoreboard,
    restartGame,
    goToHome,
  } = useGameLogic();

  // Creamos componentes para las diferentes pantallas del juego para mejor organización
  const LoadingScreen = () => (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 
                    flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-white"
      >
        <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-purple-200">
          Cargando preguntas...
        </h2>
      </motion.div>
    </div>
  );

  // Renderizado condicional según el estado del juego
  if (isLoading) return <LoadingScreen />;
  if (gameState.gameStatus === "SETUP")
    return <TeamSetup onStartGame={handleTeamSetup} />;
  if (gameState.gameStatus === "TEAM_SELECTION") {
    return (
      <TeamSelector teams={gameState.teams} onStartGame={handleTeamSelection} />
    );
  }
  if (gameState.gameStatus === "FINISHED") {
    return (
      <GameOver
        teams={gameState.teams}
        onRestart={restartGame}
        onHome={goToHome}
      />
    );
  }

  // Contenido principal del juego
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="h-full flex flex-col p-8">
        {/* Cabecera del juego */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center space-x-4">
            {gameState.currentQuestion && (
              <Timer
                questionId={currentQuestionId || ""}
                duration={
                  GAME_CONFIG.QUESTION_TIME[gameState.currentQuestion.category]
                }
                onTimeUp={handleTimeUp}
                isActive={!showModal}
              />
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 
                     flex items-center space-x-3"
            >
              <ArrowLeftRight className="text-purple-300" size={24} />
              <span className="text-2xl font-medium">
                Turno: {gameState.teams[gameState.currentTeam]?.name || ""}
              </span>
            </motion.div>
          </div>

          {/* Controles del juego */}
          <div className="flex items-center space-x-4">
            {/* Botón para mostrar/ocultar marcador */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleScoreboard}
              className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3
                     flex items-center space-x-3 text-white hover:bg-white/20
                     transition-colors duration-200"
            >
              <ChartBar className="text-purple-300" size={24} />
              <span className="text-xl">
                {showScoreboard ? "Ocultar Marcador" : "Ver Marcador"}
              </span>
            </motion.button>

            {/* Botón para terminar el juego */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endGame}
              className="bg-red-500/20 backdrop-blur-sm rounded-xl px-6 py-3
                     flex items-center space-x-3 text-white hover:bg-red-500/30
                     transition-colors duration-200 border border-red-500/30"
            >
              <Flag className="text-red-400" size={24} />
              <span className="text-xl">Terminar Juego</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Área principal del juego */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Marcador condicional */}
            {showScoreboard && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <ScoreBoard
                  teams={gameState.teams}
                  currentTeam={gameState.currentTeam}
                />
              </motion.div>
            )}

            {/* Área de preguntas */}
            <motion.div
              key={currentQuestionId || "loading"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 relative"
            >
              {gameState.currentQuestion ? (
                <QuestionCard
                  question={gameState.currentQuestion}
                  timeRemaining={gameState.timeRemaining}
                  onAnswerSelect={handleAnswerSelect}
                  currentTeam={gameState.currentTeam}
                  teamName={gameState.teams[gameState.currentTeam]?.name || ""}
                />
              ) : (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0.5, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
                    <h2 className="text-4xl font-bold text-purple-200">
                      ¡Preparando siguiente pregunta!
                    </h2>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal de respuesta */}
        {selectedAnswer && (
          <AnswerModal
            isOpen={showModal}
            onClose={handleModalClose}
            isCorrect={selectedAnswer.isCorrect}
            biblicalReference={selectedAnswer.biblicalReference}
            explanation={selectedAnswer.explanation}
            points={selectedAnswer.points}
            selectedAnswer={selectedAnswer.selectedAnswer}
            correctAnswer={selectedAnswer.correctAnswer}
            options={selectedAnswer.options}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
