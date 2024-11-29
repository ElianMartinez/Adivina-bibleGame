import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  Info,
  AlertCircle,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import type { Question } from "../types/game";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  biblicalReference: Question["biblicalReference"];
  explanation?: string;
  points: number;
  selectedAnswer: string;
  correctAnswer: string;
  options: Question["options"];
}

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  isCorrect,
  biblicalReference,
  explanation,
  points,
  selectedAnswer,
  correctAnswer,
  options,
}) => {
  // Encontrar el texto de la respuesta correcta
  const correctAnswerText = options.find(
    (opt) => opt.id === correctAnswer
  )?.text;
  const selectedAnswerText = options.find(
    (opt) => opt.id === selectedAnswer
  )?.text;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl overflow-hidden rounded-3xl
                       bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900
                       p-8 text-white shadow-[0_0_50px_rgba(168,85,247,0.3)]
                       relative"
            >
              {/* Resultado y Puntos */}
              <motion.div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-24 h-24 text-green-400" />
                  ) : (
                    <XCircle className="w-24 h-24 text-red-400" />
                  )}
                </motion.div>

                <Dialog.Title className="text-5xl font-bold mt-4 mb-2">
                  {isCorrect ? "¡Correcto!" : "Incorrecto"}
                </Dialog.Title>

                <div className="text-2xl text-purple-200">{points} puntos</div>
              </motion.div>

              {/* Respuesta Seleccionada vs Correcta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-purple-300" size={24} />
                  <h3 className="text-2xl font-semibold text-purple-200">
                    Respuestas
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-xl text-purple-200">Tu respuesta:</div>
                    <div
                      className={`text-xl font-medium ${
                        isCorrect ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {selectedAnswerText}
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="flex items-start gap-4">
                      <div className="text-xl text-purple-200">
                        Respuesta correcta:
                      </div>
                      <div className="text-xl font-medium text-green-400">
                        {correctAnswerText}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Referencia Bíblica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-purple-300" size={24} />
                  <h3 className="text-2xl font-semibold text-purple-200">
                    Referencia Bíblica
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-2xl text-purple-100">
                    {biblicalReference.book} {biblicalReference.chapter}:
                    {biblicalReference.verse}
                  </p>
                  <p className="text-xl text-purple-200 italic border-l-4 border-purple-500 pl-4">
                    "{biblicalReference.text}"
                  </p>
                </div>
              </motion.div>

              {/* Explicación */}
              {explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="text-purple-300" size={24} />
                    <h3 className="text-2xl font-semibold text-purple-200">
                      Explicación
                    </h3>
                  </div>
                  <p className="text-xl text-purple-200">{explanation}</p>
                </motion.div>
              )}

              {/* Botón Continuar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={`
                    px-8 py-4 text-2xl rounded-lg
                    transition-all duration-200
                    ${
                      isCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    }
                  `}
                >
                  Continuar
                </motion.button>
              </motion.div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AnswerModal;
