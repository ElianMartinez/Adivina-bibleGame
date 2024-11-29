import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Clock, Star, Sparkles, Zap } from "lucide-react";
import type { Question } from "../types/game";

interface QuestionCardProps {
  question: Question;
  timeRemaining: number;
  onAnswerSelect: (answerId: string) => void;
  currentTeam: string;
  teamName: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  timeRemaining,
  onAnswerSelect,
  teamName,
}) => {
  // Configuración de dificultad con colores y efectos visuales mejorados
  const difficultyConfig = {
    EASY: {
      gradient: "from-green-600/30 via-green-500/20 to-green-800/30",
      icon: Star,
      bgGlow: "0 0 100px rgba(34, 197, 94, 0.2)",
      textColor: "text-green-400",
    },
    MEDIUM: {
      gradient: "from-yellow-600/30 via-yellow-500/20 to-yellow-800/30",
      icon: Zap,
      bgGlow: "0 0 100px rgba(234, 179, 8, 0.2)",
      textColor: "text-yellow-400",
    },
    HARD: {
      gradient: "from-red-600/30 via-red-500/20 to-red-800/30",
      icon: Sparkles,
      bgGlow: "0 0 100px rgba(239, 68, 68, 0.2)",
      textColor: "text-red-400",
    },
  };

  // Iconos y estilos para tipos de preguntas
  const typeConfig = {
    CHARACTER: { emoji: "👤", label: "Personaje" },
    QUOTE: { emoji: "💬", label: "Cita" },
    PLACE: { emoji: "🏛️", label: "Lugar" },
    BOOK: { emoji: "📖", label: "Libro" },
    CHARACTERISTICS: { emoji: "✨", label: "Características" },
  };

  // Variantes de animación para diferentes elementos
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 0 15px rgba(168, 85, 247, 0.2)",
    },
  };

  const DifficultyIcon = difficultyConfig[question.category].icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4"
    >
      {/* Header section */}
      <motion.div
        variants={headerVariants}
        className="flex justify-between items-center mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-4"
        >
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4 
                       flex items-center space-x-4 shadow-lg border border-white/10"
          >
            <Book className="text-purple-300" size={32} />
            <div className="flex flex-col">
              <span className="text-purple-300 text-sm">Equipo</span>
              <span
                className="text-3xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-purple-300 to-pink-300"
              >
                {teamName}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4 
                   flex items-center space-x-4 shadow-lg border border-white/10"
        >
          <Clock className="text-purple-300" size={32} />
          <div className="flex flex-col">
            <span className="text-purple-300 text-sm">Tiempo</span>
            <span className="text-3xl font-bold tabular-nums">
              {timeRemaining}s
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main question card */}
      <motion.div
        className={`
          bg-gradient-to-br ${difficultyConfig[question.category].gradient}
          backdrop-blur-lg rounded-3xl p-10 shadow-xl
          border border-white/10 relative overflow-hidden
        `}
        style={{ boxShadow: difficultyConfig[question.category].bgGlow }}
      >
        {/* Animated background effects */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          style={{ boxShadow: difficultyConfig[question.category].bgGlow }}
        />

        {/* Question header */}
        <motion.div
          variants={questionVariants}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <span className="text-5xl">{typeConfig[question.type].emoji}</span>
            <span className="text-xl text-purple-200">
              {typeConfig[question.type].label}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <DifficultyIcon
              className={`w-6 h-6 ${
                difficultyConfig[question.category].textColor
              }`}
            />
            <span
              className={`
              px-6 py-2 rounded-full text-xl font-medium
              border border-white/20 backdrop-blur-sm
              ${difficultyConfig[question.category].textColor}
            `}
            >
              {question.category}
            </span>
          </div>
        </motion.div>

        {/* Question text */}
        <motion.h2
          variants={questionVariants}
          className="text-6xl font-bold mb-12 leading-tight"
        >
          {question.question}
        </motion.h2>

        {/* Options grid */}
        <motion.div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => (
              <motion.button
                key={option.id}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onAnswerSelect(option.id)}
                className={`
                  w-full p-8 text-4xl bg-white/10 rounded-2xl
                  backdrop-blur-sm border-2 border-white/10
                  transition-colors duration-300 group
                  hover:border-purple-400/50
                `}
              >
                <motion.div className="flex items-center space-x-6">
                  <motion.span
                    className="w-16 h-16 flex items-center justify-center
                             bg-white/10 rounded-xl text-3xl font-bold
                             group-hover:bg-purple-500/20 transition-colors"
                  >
                    {String.fromCharCode(65 + index)}
                  </motion.span>
                  <span className="text-left text-3xl">{option.text}</span>
                </motion.div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0
                           opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black, transparent)",
                  }}
                  animate={{
                    x: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionCard;
