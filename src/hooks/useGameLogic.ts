import { useState, useEffect, useCallback } from "react";
import type { GameState, Question } from "../types/game";
import { useGameSounds } from "./useGameSounds";

// Configuración central del juego con valores constantes
export const GAME_CONFIG = {
  QUESTION_TIME: {
    EASY: 10, // 10 segundos para preguntas fáciles
    MEDIUM: 15, // 15 segundos para preguntas medias
    HARD: 30, // 30 segundos para preguntas difíciles
  },
  POINTS: {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300,
  },
  QUESTIONS_PER_DIFFICULTY: {
    EASY: 10, // Aumentado a 10 preguntas por categoría
    MEDIUM: 10,
    HARD: 10,
  },
} as const;

// Estado inicial del juego - Mantenerlo simple y claro
const initialGameState: GameState = {
  teams: {},
  currentTeam: "",
  gameStatus: "SETUP",
  currentQuestion: undefined,
  timeRemaining: 0,
};

// Interfaz para la respuesta seleccionada para mejor tipado
interface SelectedAnswerType {
  isCorrect: boolean;
  points: number;
  biblicalReference: Question["biblicalReference"];
  explanation?: string;
  selectedAnswer: string;
  correctAnswer: string;
  options: Question["options"];
}

// Interfaz que define todo lo que el hook retorna
interface GameLogicReturn {
  // Estados del juego
  gameState: GameState;
  isLoading: boolean;
  showModal: boolean;
  showScoreboard: boolean;
  selectedAnswer: SelectedAnswerType | null;
  currentQuestionId: string | null;

  // Manejadores de acciones del juego
  handleTeamSetup: (teams: GameState["teams"]) => void;
  handleTeamSelection: (firstTeam: "team1" | "team2") => void;
  handleAnswerSelect: (answerId: string) => void;
  handleModalClose: () => void;
  handleTimeUp: () => void;
  toggleScoreboard: () => void;
  restartGame: () => void;
  goToHome: () => void;
  endGame: () => void;
  getGameProgress: () => void; // Tipo de retorno no especificado

  // Utilidades y ayudantes
  checkGameCompletion: () => boolean;
  getCurrentQuestionId: () => string | null;
}

export function useGameLogic(): GameLogicReturn {
  // Estados principales del juego
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] =
    useState<SelectedAnswerType | null>(null);

  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(
    new Set()
  );

  // Hook para efectos de sonido
  const { playSound } = useGameSounds();

  // Efecto para persistir el estado del juego
  useEffect(() => {
    const savedState = localStorage.getItem("bibleQuizGame");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setGameState(parsedState);
      } catch (error) {
        console.error("Error loading saved game state:", error);
      }
    }
  }, []);

  // Efecto para guardar el estado del juego
  useEffect(() => {
    if (gameState !== initialGameState) {
      localStorage.setItem("bibleQuizGame", JSON.stringify(gameState));
    }
  }, [gameState]);

  // Efecto para cargar las preguntas al inicio
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/questions.json");
        if (!response.ok) throw new Error("Error al cargar las preguntas");

        const data = await response.json();
        if (!Array.isArray(data.questions)) {
          throw new Error("Formato de preguntas inválido");
        }

        // Mezclamos las preguntas para mayor aleatoriedad
        const shuffledQuestions = [...data.questions].sort(
          () => Math.random() - 0.5
        );

        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Efecto para actualizar el ID de la pregunta actual
  useEffect(() => {
    if (gameState.currentQuestion) {
      setCurrentQuestionId(gameState.currentQuestion.id);
    } else {
      setCurrentQuestionId(null);
    }
  }, [gameState.currentQuestion]);

  // Verificar si el juego debe terminar
  const checkGameCompletion = useCallback(() => {
    if (!gameState.teams) return false;

    return Object.values(gameState.teams).every((team) => {
      if (!team?.questionsAnswered) return false;

      return Object.entries(GAME_CONFIG.QUESTIONS_PER_DIFFICULTY).every(
        ([difficulty, max]) => {
          const answered =
            team.questionsAnswered[
              difficulty.toLowerCase() as keyof typeof team.questionsAnswered
            ] || 0;
          // Ahora verificamos exactamente 10 preguntas por categoría
          return answered >= max;
        }
      );
    });
  }, [gameState.teams]);

  // Efecto para verificar el fin del juego
  useEffect(() => {
    if (gameState.gameStatus === "PLAYING" && checkGameCompletion()) {
      setGameState((prev) => ({ ...prev, gameStatus: "FINISHED" }));
      playSound("success"); // Sonido de victoria al terminar el juego
    }
  }, [gameState.teams, gameState.gameStatus, checkGameCompletion, playSound]);

  // Obtener siguiente pregunta disponible
  const getNextQuestion = useCallback(
    (teamId: string): Question | undefined => {
      // Validaciones iniciales
      if (!questions.length || !gameState.teams?.[teamId]) {
        console.log("No hay preguntas disponibles o el equipo no existe");
        return undefined;
      }

      const team = gameState.teams[teamId];

      // Verificamos el total de preguntas respondidas
      const totalAnswered = Object.values(team.questionsAnswered).reduce(
        (sum, count) => sum + count,
        0
      );

      // Si ya respondió 30 preguntas, terminamos
      if (totalAnswered >= 30) {
        console.log(`El equipo ${teamId} ya completó sus 30 preguntas`);
        return undefined;
      }

      // Obtenemos todas las preguntas que no han sido usadas
      const unusedQuestions = questions.filter(
        (q) => !usedQuestionIds.has(q.id)
      );

      if (unusedQuestions.length === 0) {
        console.log("No hay más preguntas disponibles");
        return undefined;
      }

      // Intentamos primero obtener una pregunta de la categoría ideal
      let selectedQuestion: Question | undefined;

      // Primero intentamos mantener el balance ideal (10 de cada categoría)
      const categoryBalances = {
        EASY: 10 - (team.questionsAnswered.easy || 0),
        MEDIUM: 10 - (team.questionsAnswered.medium || 0),
        HARD: 10 - (team.questionsAnswered.hard || 0),
      };

      // Filtramos las categorías que aún necesitan preguntas
      const availableCategories = Object.entries(categoryBalances)
        .filter(([_, remaining]) => remaining > 0)
        .map(([category]) => category as "EASY" | "MEDIUM" | "HARD");

      if (availableCategories.length > 0) {
        // Intentamos obtener una pregunta de las categorías disponibles
        const availableQuestions = unusedQuestions.filter((q) =>
          availableCategories.includes(q.category)
        );

        if (availableQuestions.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableQuestions.length
          );
          selectedQuestion = availableQuestions[randomIndex];
        }
      }

      // Si no encontramos una pregunta manteniendo el balance,
      // simplemente tomamos cualquier pregunta no usada
      if (!selectedQuestion && unusedQuestions.length > 0) {
        console.log(
          "Usando pregunta de categoría alternativa por falta de disponibilidad"
        );
        const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
        selectedQuestion = unusedQuestions[randomIndex];
      }

      if (!selectedQuestion) {
        console.log("No se pudo encontrar una pregunta válida");
        return undefined;
      }

      // Registramos la pregunta como usada
      setUsedQuestionIds((prev) => new Set([...prev, selectedQuestion!.id]));

      // Log del progreso actual
      console.log(`Pregunta seleccionada para ${teamId}:`, {
        category: selectedQuestion.category,
        id: selectedQuestion.id,
        preguntasRespondidasPorCategoria: {
          EASY: team.questionsAnswered.easy || 0,
          MEDIUM: team.questionsAnswered.medium || 0,
          HARD: team.questionsAnswered.hard || 0,
        },
        preguntasRestantesPorCategoria: categoryBalances,
        totalPreguntas: totalAnswered,
      });

      return selectedQuestion;
    },
    [questions, gameState.teams, usedQuestionIds]
  );

  // Manejador para la configuración inicial de equipos
  const handleTeamSetup = useCallback(
    (teams: GameState["teams"]) => {
      playSound("success");

      // Reiniciamos el set de preguntas usadas
      setUsedQuestionIds(new Set());

      // Iniciamos un nuevo estado de juego con los equipos
      setGameState((prev) => ({
        ...prev,
        teams,
        gameStatus: "TEAM_SELECTION",
        currentQuestion: undefined,
      }));

      // También podríamos querer reiniciar otras cosas relacionadas con el juego
      setShowScoreboard(false);
      setShowModal(false);
      setSelectedAnswer(null);
      setCurrentQuestionId(null);
    },
    [playSound]
  );
  const getGameProgress = useCallback(() => {
    if (!gameState.teams) return null;

    // Esta función nos da una vista detallada del progreso del juego
    const progressByTeam = Object.entries(gameState.teams).reduce(
      (progress, [teamId, team]) => {
        // Para cada equipo, calculamos su progreso por categoría
        const categoryProgress = Object.entries(team.questionsAnswered).reduce(
          (catAcc, [category, answered]) => {
            const total =
              GAME_CONFIG.QUESTIONS_PER_DIFFICULTY[
                category.toUpperCase() as keyof typeof GAME_CONFIG.QUESTIONS_PER_DIFFICULTY
              ];

            return {
              ...catAcc,
              [category]: {
                answered, // Cuántas preguntas se han respondido
                total, // Total de preguntas requeridas
                remaining: total - answered, // Cuántas faltan
                percentage: Math.round((answered / total) * 100), // Porcentaje completado
              },
            };
          },
          {}
        );

        // También calculamos estadísticas generales del equipo
        const totalAnswered = Object.values(team.questionsAnswered).reduce(
          (sum, count) => sum + count,
          0
        );
        const totalRequired = Object.values(
          GAME_CONFIG.QUESTIONS_PER_DIFFICULTY
        ).reduce((sum, count) => sum + count, 0);

        return {
          ...progress,
          [teamId]: {
            byCategory: categoryProgress,
            overall: {
              answered: totalAnswered,
              total: totalRequired,
              remaining: totalRequired - totalAnswered,
              percentage: Math.round((totalAnswered / totalRequired) * 100),
            },
          },
        };
      },
      {}
    );

    // También incluimos estadísticas generales del juego
    const totalQuestionsUsed = usedQuestionIds.size;
    const totalQuestionsAvailable = questions.length;

    return {
      teams: progressByTeam,
      game: {
        questionsUsed: totalQuestionsUsed,
        questionsAvailable: totalQuestionsAvailable,
        questionsRemaining: totalQuestionsAvailable - totalQuestionsUsed,
        percentage: Math.round(
          (totalQuestionsUsed / totalQuestionsAvailable) * 100
        ),
      },
    };
  }, [gameState.teams, usedQuestionIds.size, questions.length]);

  // Manejador para la selección del equipo inicial
  const handleTeamSelection = useCallback(
    (firstTeam: "team1" | "team2") => {
      playSound("success");
      const nextQuestion = getNextQuestion(firstTeam);

      setGameState((prev) => ({
        ...prev,
        currentTeam: firstTeam,
        gameStatus: "PLAYING",
        currentQuestion: nextQuestion,
        // Asignamos el tiempo según la dificultad de la pregunta
        timeRemaining: nextQuestion
          ? GAME_CONFIG.QUESTION_TIME[nextQuestion.category]
          : 0,
      }));

      if (nextQuestion) {
        setCurrentQuestionId(nextQuestion.id);
      }
    },
    [getNextQuestion, playSound]
  );

  // Manejador para la selección de respuesta
  const handleAnswerSelect = useCallback(
    (answerId: string) => {
      if (!gameState.currentQuestion) return;

      const isCorrect = answerId === gameState.currentQuestion.correctAnswer;
      playSound(isCorrect ? "correct" : "wrong");

      // Actualizamos la puntuación si la respuesta es correcta
      if (isCorrect && gameState.currentTeam) {
        const points = GAME_CONFIG.POINTS[gameState.currentQuestion.category];

        setGameState((prev) => ({
          ...prev,
          teams: {
            ...prev.teams,
            [prev.currentTeam]: {
              ...prev.teams[prev.currentTeam],
              score: prev.teams[prev.currentTeam].score + points,
              questionsAnswered: {
                ...prev.teams[prev.currentTeam].questionsAnswered,
                [gameState.currentQuestion!.category.toLowerCase()]:
                  (prev.teams[prev.currentTeam].questionsAnswered[
                    gameState.currentQuestion!.category.toLowerCase() as keyof (typeof prev.teams)[typeof prev.currentTeam]["questionsAnswered"]
                  ] || 0) + 1,
              },
            },
          },
        }));
      }

      // Configuramos la información de la respuesta para el modal
      setSelectedAnswer({
        isCorrect,
        points: isCorrect
          ? GAME_CONFIG.POINTS[gameState.currentQuestion.category]
          : 0,
        biblicalReference: gameState.currentQuestion.biblicalReference,
        explanation: gameState.currentQuestion.explanation,
        selectedAnswer: answerId,
        correctAnswer: gameState.currentQuestion.correctAnswer,
        options: gameState.currentQuestion.options,
      });

      setShowModal(true);
    },
    [gameState.currentQuestion, gameState.currentTeam, playSound]
  );

  // En handleModalClose:
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedAnswer(null);

    setGameState((prev) => {
      const nextTeam = prev.currentTeam === "team1" ? "team2" : "team1";
      const nextQuestion = getNextQuestion(nextTeam);

      // Verificamos si el juego debe terminar
      if (!nextQuestion && checkGameCompletion()) {
        return { ...prev, gameStatus: "FINISHED" };
      }

      return {
        ...prev,
        currentTeam: nextTeam,
        currentQuestion: nextQuestion,
        // Asignamos el tiempo según la dificultad de la nueva pregunta
        timeRemaining: nextQuestion
          ? GAME_CONFIG.QUESTION_TIME[nextQuestion.category]
          : 0,
      };
    });
  }, [getNextQuestion, checkGameCompletion]);

  // Manejador para cuando se acaba el tiempo
  const handleTimeUp = useCallback(() => {
    if (!gameState.currentQuestion) return;

    playSound("wrong");
    setSelectedAnswer({
      isCorrect: false,
      points: 0,
      biblicalReference: gameState.currentQuestion.biblicalReference,
      explanation: "¡Se acabó el tiempo!",
      selectedAnswer: "",
      correctAnswer: gameState.currentQuestion.correctAnswer,
      options: gameState.currentQuestion.options,
    });

    setShowModal(true);
  }, [gameState.currentQuestion, playSound]);

  // Manejadores adicionales para la interfaz
  const toggleScoreboard = useCallback(() => {
    setShowScoreboard((prev) => !prev);
  }, []);

  const restartGame = useCallback(() => {
    playSound("success");
    setGameState((prev) => ({
      ...prev,
      gameStatus: "TEAM_SELECTION",
      currentQuestion: undefined,
    }));
    setCurrentQuestionId(null);
  }, [playSound]);

  const goToHome = useCallback(() => {
    localStorage.removeItem("bibleQuizGame");
    setGameState(initialGameState);
    setCurrentQuestionId(null);
  }, []);

  const getCurrentQuestionId = useCallback(
    () => currentQuestionId,
    [currentQuestionId]
  );

  const endGame = useCallback(() => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas terminar el juego? Esto mostrará los resultados finales."
      )
    ) {
      setGameState((prev) => ({
        ...prev,
        gameStatus: "FINISHED",
      }));
      playSound("success");
    }
  }, [playSound]);

  // Retornamos todas las funciones y estados necesarios
  return {
    gameState,
    isLoading,
    showModal,
    showScoreboard,
    selectedAnswer,
    currentQuestionId,
    handleTeamSetup,
    handleTeamSelection,
    handleAnswerSelect,
    handleModalClose,
    handleTimeUp,
    toggleScoreboard,
    restartGame,
    endGame,
    goToHome,
    checkGameCompletion,
    getCurrentQuestionId,
    getGameProgress,
  };
}
