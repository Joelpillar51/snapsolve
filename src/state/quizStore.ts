import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizSession {
  id: string;
  subject: string;
  questions: QuizQuestion[];
  answers: (number | null)[];
  currentQuestion: number;
  completed: boolean;
  score: number;
  date: string;
}

export interface QuizState {
  currentSession: QuizSession | null;
  quizHistory: QuizSession[];
  
  // Actions
  startQuiz: (subject: string, questions: QuizQuestion[]) => void;
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  completeQuiz: () => void;
  clearCurrentSession: () => void;
}

const generateQuizId = () => Math.random().toString(36).substr(2, 9);

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      quizHistory: [],

      startQuiz: (subject: string, questions: QuizQuestion[]) => {
        const newSession: QuizSession = {
          id: generateQuizId(),
          subject,
          questions,
          answers: new Array(questions.length).fill(null),
          currentQuestion: 0,
          completed: false,
          score: 0,
          date: new Date().toISOString(),
        };
        
        set({ currentSession: newSession });
      },

      answerQuestion: (questionIndex: number, answerIndex: number) => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const updatedSession = {
            ...state.currentSession,
            answers: [...state.currentSession.answers],
          };
          
          updatedSession.answers[questionIndex] = answerIndex;
          
          return {
            currentSession: updatedSession,
          };
        });
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const nextIndex = state.currentSession.currentQuestion + 1;
          
          return {
            currentSession: {
              ...state.currentSession,
              currentQuestion: nextIndex,
            },
          };
        });
      },

      completeQuiz: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          // Calculate score
          let correctAnswers = 0;
          state.currentSession.questions.forEach((question, index) => {
            if (state.currentSession!.answers[index] === question.correctAnswer) {
              correctAnswers++;
            }
          });
          
          const score = Math.round((correctAnswers / state.currentSession.questions.length) * 100);
          
          const completedSession: QuizSession = {
            ...state.currentSession,
            completed: true,
            score,
          };
          
          return {
            currentSession: completedSession,
            quizHistory: [completedSession, ...state.quizHistory],
          };
        });
      },

      clearCurrentSession: () => {
        set({ currentSession: null });
      },
    }),
    {
      name: 'quiz-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);