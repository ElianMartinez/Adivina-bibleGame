export type QuestionCategory = "EASY" | "MEDIUM" | "HARD";
export type QuestionType =
  | "CHARACTER"
  | "QUOTE"
  | "PLACE"
  | "BOOK"
  | "CHARACTERISTICS";

export interface Question {
  id: string;
  category: QuestionCategory;
  type: QuestionType;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  biblicalReference: {
    book: string;
    chapter: number;
    verse: string;
    text: string;
  };
  explanation?: string;
}

export interface Team {
  name: string;
  score: number;
  questionsAnswered: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface GameState {
  teams: Record<string, Team>;
  currentQuestion?: Question;
  currentTeam: string;
  gameStatus: GamePhase;
  timeRemaining: number;
}

export interface AnswerFeedback {
  isCorrect: boolean;
  biblicalReference: Question["biblicalReference"];
  explanation?: string;
}

export type GamePhase =
  | "SETUP"
  | "TEAM_SELECTION"
  | "PLAYING"
  | "SCORE_VIEW"
  | "FINISHED";
