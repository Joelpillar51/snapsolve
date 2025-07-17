import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  // User info
  userId: string;
  avatarId: number;
  xp: number;
  level: number;
  
  // Subscription
  isPro: boolean;
  
  // Daily limits
  dailySolves: number;
  dailyQuizzes: number;
  lastResetDate: string;
  
  // Progress tracking
  streak: number;
  lastActiveDate: string;
  
  // Actions
  incrementXP: (amount: number) => void;
  useSolve: () => boolean;
  useQuiz: () => boolean;
  updateStreak: () => void;
  setAvatar: (avatarId: number) => void;
  upgradeToPro: () => void;
  resetDailyLimits: () => void;
}

const generateUserId = () => Math.random().toString(36).substr(2, 9);

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: generateUserId(),
      avatarId: 1,
      xp: 0,
      level: 1,
      isPro: false,
      dailySolves: 0,
      dailyQuizzes: 0,
      lastResetDate: getTodayString(),
      streak: 0,
      lastActiveDate: getTodayString(),

      incrementXP: (amount: number) => {
        set((state) => {
          const newXP = state.xp + amount;
          return {
            xp: newXP,
            level: calculateLevel(newXP),
          };
        });
      },

      useSolve: () => {
        const state = get();
        const today = getTodayString();
        
        // Reset daily limits if it's a new day
        if (state.lastResetDate !== today) {
          state.resetDailyLimits();
        }
        
        if (state.isPro || state.dailySolves < 5) {
          set((state) => ({
            dailySolves: state.dailySolves + 1,
            lastResetDate: today,
          }));
          return true;
        }
        return false;
      },

      useQuiz: () => {
        const state = get();
        const today = getTodayString();
        
        // Reset daily limits if it's a new day
        if (state.lastResetDate !== today) {
          state.resetDailyLimits();
        }
        
        if (state.isPro || state.dailyQuizzes < 1) {
          set((state) => ({
            dailyQuizzes: state.dailyQuizzes + 1,
            lastResetDate: today,
          }));
          return true;
        }
        return false;
      },

      updateStreak: () => {
        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        set((state) => {
          if (state.lastActiveDate === today) {
            // Already updated today
            return state;
          } else if (state.lastActiveDate === yesterdayString) {
            // Continue streak
            return {
              streak: state.streak + 1,
              lastActiveDate: today,
            };
          } else {
            // Reset streak
            return {
              streak: 1,
              lastActiveDate: today,
            };
          }
        });
      },

      setAvatar: (avatarId: number) => {
        set({ avatarId });
      },

      upgradeToPro: () => {
        set({ isPro: true });
      },

      resetDailyLimits: () => {
        const today = getTodayString();
        set({
          dailySolves: 0,
          dailyQuizzes: 0,
          lastResetDate: today,
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);