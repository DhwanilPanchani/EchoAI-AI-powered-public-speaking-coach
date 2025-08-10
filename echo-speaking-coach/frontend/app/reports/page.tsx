'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store';

export default function ReportsPage() {
  // Get real sessions from store
  const sessions = useAppStore((state) => state.sessions);
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-4xl font-bold">Practice Reports</h1>
          </div>
          <div className="text-gray-400">
            {sortedSessions.length} {sortedSessions.length === 1 ? 'Session' : 'Sessions'}
          </div>
        </motion.div>

        {/* Reports List */}
        {sortedSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-12 text-center"
          >
            <p className="text-gray-400 mb-4">No practice sessions yet</p>
            <Link
              href="/practice"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg transition-shadow"
            >
              Start Your First Session
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/reports/${session.id}`}>
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 hover:bg-gray-800/70 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`text-3xl font-bold ${getScoreColor(session.overallScore)}`}>
                            {session.overallScore}%
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(session.date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">
                              {formatDuration(session.duration)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">
                              {session.metrics?.pace || 0} WPM
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">
                              {session.wordCount || 0} words
                            </span>
                          </div>
                          <div className="text-gray-400">
                            {session.metrics?.totalFillers || 0} filler words
                          </div>
                        </div>

                        {/* Preview of strengths if available */}
                        {session.strengths && session.strengths.length > 0 && (
                          <div className="mt-3 text-sm text-green-400">
                            ✓ {session.strengths[0]}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 text-gray-400">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {sortedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Practice Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(sortedSessions.reduce((acc, s) => acc + s.duration, 0) / 60)} min
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(sortedSessions.reduce((acc, s) => acc + s.overallScore, 0) / sortedSessions.length)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Pace</p>
                <p className="text-2xl font-bold">
                  {Math.round(sortedSessions.reduce((acc, s) => acc + (s.metrics?.pace || 0), 0) / sortedSessions.length)} WPM
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Words</p>
                <p className="text-2xl font-bold">
                  {sortedSessions.reduce((acc, s) => acc + (s.wordCount || 0), 0)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}