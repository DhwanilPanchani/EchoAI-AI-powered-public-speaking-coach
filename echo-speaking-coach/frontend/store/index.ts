// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   bio?: string;
//   avatar?: string;
// }

// interface AppState {
//   // Auth
//   user: User | null;
//   token: string | null;
//   setAuth: (user: User, token: string) => void;
//   updateUser: (user: User) => void;
//   logout: () => void;

//   // Sessions
//   sessions: any[];
//   addSession: (session: any) => void;
  
//   // User Stats
//   userStats: {
//     totalSessions: number;
//     totalPracticeTime: number;
//     averageScore: number;
//     improvement: number;
//     weeklyGoal: number;
//     weeklyProgress: number;
//   };
//   updateStats: (stats: Partial<AppState['userStats']>) => void;

//   // Achievements
//   achievements: {
//     id: string;
//     title: string;
//     description: string;
//     icon: string;
//     unlockedAt?: Date;
//   }[];
//   unlockAchievement: (achievementId: string) => void;

//   // Settings
//   settings: {
//     theme: 'light' | 'dark';
//     enableCamera: boolean;
//     enableMicrophone: boolean;
//     targetPace: number;
//     dailyGoal: number;
//     weeklyGoal: number;
//     emailNotifications: boolean;
//     soundEffects: boolean;
//   };
//   updateSettings: (settings: Partial<AppState['settings']>) => void;
// }

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       // Auth
//       user: null,
//       token: null,
//       setAuth: (user, token) => {
//         set({ user, token });
//       },
//       updateUser: (user) => {
//         set({ user });
//       },
//       logout: () => {
//         set({ 
//           user: null, 
//           token: null, 
//           sessions: [],
//           userStats: {
//             totalSessions: 0,
//             totalPracticeTime: 0,
//             averageScore: 0,
//             improvement: 0,
//             weeklyGoal: 5,
//             weeklyProgress: 0
//           }
//         });
//       },

//       // Sessions
//       sessions: [],
//       addSession: (session) => set((state) => ({
//         sessions: [...state.sessions, session],
//         userStats: {
//           ...state.userStats,
//           totalSessions: state.userStats.totalSessions + 1,
//           totalPracticeTime: state.userStats.totalPracticeTime + session.duration,
//           weeklyProgress: state.userStats.weeklyProgress + 1
//         }
//       })),

//       // User Stats
//       userStats: {
//         totalSessions: 0,
//         totalPracticeTime: 0,
//         averageScore: 0,
//         improvement: 0,
//         weeklyGoal: 5,
//         weeklyProgress: 0
//       },
//       updateStats: (stats) => set((state) => ({
//         userStats: { ...state.userStats, ...stats }
//       })),

//       // Achievements
//       achievements: [
//         {
//           id: 'first_session',
//           title: 'First Steps',
//           description: 'Complete your first practice session',
//           icon: '🎯'
//         },
//         {
//           id: 'streak_3',
//           title: 'Consistent Speaker',
//           description: 'Practice 3 days in a row',
//           icon: '🔥'
//         },
//         {
//           id: 'score_80',
//           title: 'High Achiever',
//           description: 'Score 80% or higher',
//           icon: '⭐'
//         },
//         {
//           id: 'no_fillers',
//           title: 'Smooth Talker',
//           description: 'Complete a session with no filler words',
//           icon: '💎'
//         }
//       ],
//       unlockAchievement: (achievementId) => set((state) => ({
//         achievements: state.achievements.map(a => 
//           a.id === achievementId 
//             ? { ...a, unlockedAt: new Date() }
//             : a
//         )
//       })),

//       // Settings
//       settings: {
//         theme: 'dark',
//         enableCamera: true,
//         enableMicrophone: true,
//         targetPace: 150,
//         dailyGoal: 1,
//         weeklyGoal: 5,
//         emailNotifications: true,
//         soundEffects: true
//       },
//       updateSettings: (newSettings) => set((state) => ({
//         settings: { ...state.settings, ...newSettings }
//       }))
//     }),
//     {
//       name: 'echo-storage',
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//         settings: state.settings,
//         achievements: state.achievements,
//         userStats: state.userStats
//       })
//     }
//   )
// );






import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;

  // Sessions
  sessions: any[];
  addSession: (session: any) => void;
  
  // User Stats
  userStats: {
    totalSessions: number;
    totalPracticeTime: number;
    averageScore: number;
    improvement: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  updateStats: (stats: Partial<AppState['userStats']>) => void;

  // Achievements
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
  }[];
  unlockAchievement: (achievementId: string) => void;

  // Settings
  settings: {
    enableCamera: boolean;
    enableMicrophone: boolean;
    targetPace: number;
    dailyGoal: number;
    weeklyGoal: number;
    emailNotifications: boolean;
    soundEffects: boolean;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => {
        // Don't store avatar in localStorage to save space
        const userToStore = user.avatar ? { ...user, avatar: undefined } : user;
        set({ user, token });
      },
      updateUser: (user) => {
        try {
          // Don't persist avatar to save space
          const userToStore = user.avatar ? { ...user, avatar: undefined } : user;
          set({ user });
        } catch (error) {
          console.error('Failed to update user:', error);
          // Still update in memory even if persist fails
          set({ user });
        }
      },
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          sessions: [],
          userStats: {
            totalSessions: 0,
            totalPracticeTime: 0,
            averageScore: 0,
            improvement: 0,
            weeklyGoal: 5,
            weeklyProgress: 0
          }
        });
      },

      // Sessions
      sessions: [],
      addSession: (session) => set((state) => {
        // Keep only last 10 sessions to save space
        const newSessions = [...state.sessions, session].slice(-10);
        return {
          sessions: newSessions,
          userStats: {
            ...state.userStats,
            totalSessions: state.userStats.totalSessions + 1,
            totalPracticeTime: state.userStats.totalPracticeTime + session.duration,
            weeklyProgress: state.userStats.weeklyProgress + 1
          }
        };
      }),

      // User Stats
      userStats: {
        totalSessions: 0,
        totalPracticeTime: 0,
        averageScore: 0,
        improvement: 0,
        weeklyGoal: 5,
        weeklyProgress: 0
      },
      updateStats: (stats) => set((state) => ({
        userStats: { ...state.userStats, ...stats }
      })),

      // Achievements
      achievements: [
        {
          id: 'first_session',
          title: 'First Steps',
          description: 'Complete your first practice session',
          icon: '🎯'
        },
        {
          id: 'streak_3',
          title: 'Consistent Speaker',
          description: 'Practice 3 days in a row',
          icon: '🔥'
        },
        {
          id: 'score_80',
          title: 'High Achiever',
          description: 'Score 80% or higher',
          icon: '⭐'
        },
        {
          id: 'no_fillers',
          title: 'Smooth Talker',
          description: 'Complete a session with no filler words',
          icon: '💎'
        }
      ],
      unlockAchievement: (achievementId) => set((state) => ({
        achievements: state.achievements.map(a => 
          a.id === achievementId 
            ? { ...a, unlockedAt: new Date() }
            : a
        )
      })),

      // Settings
      settings: {
        enableCamera: true,
        enableMicrophone: true,
        targetPace: 150,
        dailyGoal: 1,
        weeklyGoal: 5,
        emailNotifications: true,
        soundEffects: true
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }))
    }),
    {
      name: 'echo-storage',
      partialize: (state) => ({
        // Only persist essential data
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
          bio: state.user.bio
          // Exclude avatar from persistence
        } : null,
        token: state.token,
        settings: state.settings,
        // Only persist unlocked achievements to save space
        achievements: state.achievements.filter(a => a.unlockedAt).map(a => ({
          id: a.id,
          unlockedAt: a.unlockedAt
        })),
        userStats: state.userStats
        // Don't persist sessions - they can be fetched from backend
      }),
      // Add storage error handling
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate storage:', error);
        }
      }
    }
  )
);