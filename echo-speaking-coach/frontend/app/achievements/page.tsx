'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store';

export default function AchievementsPage() {
  const achievements = useAppStore((state) => state.achievements);
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const progress = (unlockedCount / achievements.length) * 100;

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
            <h1 className="text-4xl font-bold">Achievements</h1>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between mb-2">
            <span>Overall Progress</span>
            <span>{unlockedCount} / {achievements.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            />
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-gray-800/50 rounded-xl p-6 border ${
                achievement.unlockedAt
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 opacity-60'
              }`}
            >
              {achievement.unlockedAt && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                  Unlocked!
                </div>
              )}
              
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
              <p className="text-gray-400 text-sm">{achievement.description}</p>
              
              {achievement.unlockedAt && (
                <p className="text-xs text-purple-400 mt-3">
                  Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}