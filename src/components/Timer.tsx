import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  questionId: string; // Agregamos el ID de la pregunta como prop
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({
  questionId,
  duration,
  onTimeUp,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  // Reseteamos el timer cuando cambia la pregunta (questionId)
  useEffect(() => {
    setTimeLeft(duration);
    setIsWarning(false);
  }, [duration, questionId]); // El questionId en las dependencias asegura el reset

  // Efecto para el conteo regresivo
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Verificamos si debemos activar la advertencia
        if (prev <= 5 && !isWarning) {
          setIsWarning(true);
        }

        // Si se acabó el tiempo
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, questionId]); // Agregamos questionId aquí también

  // Calculamos el progreso para el anillo del timer
  const progress = (timeLeft / duration) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Anillo del timer */}
      <svg className="transform -rotate-90 w-32 h-32">
        {/* Círculo de fondo */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/10"
        />
        {/* Círculo de progreso */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`
            transition-all duration-1000 ease-linear
            ${isWarning ? "text-red-500 animate-pulse" : "text-purple-400"}
          `}
        />
      </svg>

      {/* Número del timer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
      >
        <span
          className={`
          text-4xl font-bold tabular-nums
          ${isWarning ? "text-red-500" : "text-white"}
        `}
        >
          {timeLeft}
        </span>
      </motion.div>
    </div>
  );
};

export default Timer;
