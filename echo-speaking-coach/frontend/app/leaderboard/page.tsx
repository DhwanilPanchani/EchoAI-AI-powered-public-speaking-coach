'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Medal, Award, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store';

export default function LeaderboardPage() {
  const user = useAppStore((state) => state.user);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  
  // Mock leaderboard data - replace with API call
  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', score: 92, sessions: 15, improvement: 25 },
    { rank: 2, name: 'Mike Johnson', score: 89, sessions: 12, improvement: 18 },
    { rank: 3, name: 'Emma Wilson', score: 87, sessions: 14, improvement: 22 },
    { rank: 4, name: 'You', score: 85, sessions: 10, improvement: 15, isCurrentUser: true },
    { rank: 5, name: 'Alex Kumar', score: 83, sessions: 11, improvement: 12 },
    { rank: 6, name: 'Lisa Park', score: 81, sessions: 9, improvement: 10 },
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <span className="w-6 text-center font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
              Leaderboard
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-5 h-5" />
            <span>247 Active Speakers</span>
          </div>
        </motion.div>

        {/* Timeframe Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-6 py-2 rounded-lg capitalize transition-all ${
                timeframe === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              This {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>

        {/* Your Position Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">Your Position</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">#4</span>
                <div>
                  <p className="text-xl font-semibold">{user?.name || 'You'}</p>
                  <p className="text-gray-400">85% Average Score</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-2xl font-bold">+15%</p>
              <p className="text-gray-400">Improvement</p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm">
            <span>Rank</span>
            <span className="col-span-2">Speaker</span>
            <span>Avg Score</span>
            <span>Improvement</span>
          </div>
          
          {leaderboard.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-5 gap-4 p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                entry.isCurrentUser ? 'bg-purple-900/20' : ''
              }`}
            >
              <div className="flex items-center">
                {getRankIcon(entry.rank)}
              </div>
              <div className="col-span-2">
                <p className="font-semibold">{entry.name}</p>
                <p className="text-sm text-gray-400">{entry.sessions} sessions</p>
              </div>
              <div>
                <p className="text-xl font-bold">{entry.score}%</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+{entry.improvement}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Challenge Friends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 text-center"
        >
          <h3 className="text-xl font-semibold mb-2">Challenge Your Friends!</h3>
          <p className="text-gray-300 mb-4">
            Share Echo with friends and compete for the top spot
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin);
              alert('Link copied! Share with friends');
            }}
            className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Copy Invite Link
          </button>
        </motion.div>
      </div>
    </div>
  );
}