'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Clock, TrendingUp, Award, Trophy, Target, Calendar, User, Home } from 'lucide-react';
import { useAppStore } from '@/store';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const userStats = useAppStore((state) => state.userStats);
  const achievements = useAppStore((state) => state.achievements);
  const sessions = useAppStore((state) => state.sessions);

  // Calculate real stats from sessions
  const realStats = {
    totalSessions: sessions.length,
    totalPracticeTime: sessions.reduce((acc, s) => acc + (s.duration || 0), 0),
    averageScore: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length)
      : 0,
    improvement: sessions.length > 1 
      ? Math.max(0, sessions[sessions.length - 1].overallScore - sessions[0].overallScore)
      : 0,
    weeklyProgress: sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate > weekAgo;
    }).length
  };

  // Use real stats if available, otherwise use stored stats
  const displayStats = {
    totalSessions: realStats.totalSessions || userStats.totalSessions,
    totalPracticeTime: realStats.totalPracticeTime || userStats.totalPracticeTime,
    averageScore: realStats.averageScore || userStats.averageScore,
    improvement: realStats.improvement || userStats.improvement,
    weeklyGoal: userStats.weeklyGoal,
    weeklyProgress: realStats.weeklyProgress || userStats.weeklyProgress
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const recentAchievements = achievements
    .filter(a => a.unlockedAt)
    .slice(-3);

  const weeklyProgress = (displayStats.weeklyProgress / displayStats.weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-400">Ready to improve your speaking skills today?</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/practice"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg transition-shadow"
            >
              Start Practice Session
            </Link>
          </div>
        </motion.div>

        {/* Weekly Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Weekly Goal</h2>
            </div>
            <span className="text-gray-300">
              {displayStats.weeklyProgress} / {displayStats.weeklyGoal} sessions
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
          {weeklyProgress >= 100 && (
            <p className="text-green-400 text-sm mt-2">🎉 Goal achieved! Keep it up!</p>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Mic className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold">{displayStats.totalSessions}</span>
            </div>
            <p className="text-gray-400">Total Sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold">
                {Math.round(displayStats.totalPracticeTime / 60)}
              </span>
            </div>
            <p className="text-gray-400">Minutes Practiced</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold">{displayStats.averageScore}%</span>
            </div>
            <p className="text-gray-400">Average Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold">+{displayStats.improvement}%</span>
            </div>
            <p className="text-gray-400">Improvement</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/leaderboard"
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>View Leaderboard</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              
              <Link
                href="/achievements"
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>Your Achievements</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              
              <Link
                href="/reports"
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>View All Reports</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-700/50"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Complete sessions to unlock achievements!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}










// export default function DashboardPage() {
//   const router = useRouter();
//   const user = useAppStore((state) => state.user);
//   const userStats = useAppStore((state) => state.userStats);
//   const achievements = useAppStore((state) => state.achievements);
//   const sessions = useAppStore((state) => state.sessions);

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//     }
//   }, [user, router]);

//   if (!user) return null;

//   const recentAchievements = achievements
//     .filter(a => a.unlockedAt)
//     .slice(-3);

//   const weeklyProgress = (userStats.weeklyProgress / userStats.weeklyGoal) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex justify-between items-center mb-8"
//         >
//           <div>
//             <h1 className="text-4xl font-bold mb-2">
//               Welcome back, {user.name}! 👋
//             </h1>
//             <p className="text-gray-400">Ready to improve your speaking skills today?</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link
//               href="/"
//               className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
//             >
//               <Home className="w-5 h-5" />
//               <span>Home</span>
//             </Link>
//             <Link
//               href="/profile"
//               className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
//             >
//               <User className="w-5 h-5" />
//               <span>Profile</span>
//             </Link>
//             <Link
//               href="/practice"
//               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg transition-shadow"
//             >
//               Start Practice Session
//             </Link>
//           </div>
//         </motion.div>

//         {/* Weekly Goal Progress */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <Target className="w-6 h-6 text-blue-400" />
//               <h2 className="text-xl font-semibold">Weekly Goal</h2>
//             </div>
//             <span className="text-gray-300">
//               {userStats.weeklyProgress} / {userStats.weeklyGoal} sessions
//             </span>
//           </div>
//           <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
//               transition={{ duration: 1, ease: "easeOut" }}
//               className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//             />
//           </div>
//           {weeklyProgress >= 100 && (
//             <p className="text-green-400 text-sm mt-2">🎉 Goal achieved! Keep it up!</p>
//           )}
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <Mic className="w-8 h-8 text-blue-400" />
//               <span className="text-3xl font-bold">{userStats.totalSessions}</span>
//             </div>
//             <p className="text-gray-400">Total Sessions</p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <Clock className="w-8 h-8 text-purple-400" />
//               <span className="text-3xl font-bold">
//                 {Math.round(userStats.totalPracticeTime / 60)}
//               </span>
//             </div>
//             <p className="text-gray-400">Minutes Practiced</p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <Award className="w-8 h-8 text-yellow-400" />
//               <span className="text-3xl font-bold">{userStats.averageScore}%</span>
//             </div>
//             <p className="text-gray-400">Average Score</p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <TrendingUp className="w-8 h-8 text-green-400" />
//               <span className="text-3xl font-bold">+{userStats.improvement}%</span>
//             </div>
//             <p className="text-gray-400">Improvement</p>
//           </motion.div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Quick Actions */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="space-y-3">
//               <Link
//                 href="/leaderboard"
//                 className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <Trophy className="w-5 h-5 text-yellow-400" />
//                   <span>View Leaderboard</span>
//                 </div>
//                 <span className="text-gray-400">→</span>
//               </Link>
              
//               <Link
//                 href="/achievements"
//                 className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <Award className="w-5 h-5 text-purple-400" />
//                   <span>Your Achievements</span>
//                 </div>
//                 <span className="text-gray-400">→</span>
//               </Link>
              
//               <Link
//                 href="/reports"
//                 className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <Calendar className="w-5 h-5 text-blue-400" />
//                   <span>View All Reports</span>
//                 </div>
//                 <span className="text-gray-400">→</span>
//               </Link>
//             </div>
//           </motion.div>

//           {/* Recent Achievements */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.6 }}
//           >
//             <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
//             <div className="space-y-3">
//               {recentAchievements.length > 0 ? (
//                 recentAchievements.map((achievement) => (
//                   <div
//                     key={achievement.id}
//                     className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-700/50"
//                   >
//                     <span className="text-2xl">{achievement.icon}</span>
//                     <div>
//                       <p className="font-semibold">{achievement.title}</p>
//                       <p className="text-sm text-gray-400">{achievement.description}</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400 text-center py-8">
//                   Complete sessions to unlock achievements!
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }