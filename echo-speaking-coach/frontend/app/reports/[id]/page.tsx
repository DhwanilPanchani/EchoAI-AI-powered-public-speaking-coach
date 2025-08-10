'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Mic, Eye, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id;

  // Mock data - replace with real API call
  const report = {
    id: reportId,
    date: '2024-01-15',
    duration: 323, // seconds
    overallScore: 85,
    metrics: {
      averagePace: 145,
      fillerWords: {
        count: 8,
        words: [
          { word: 'um', count: 3 },
          { word: 'like', count: 2 },
          { word: 'you know', count: 2 },
          { word: 'so', count: 1 }
        ]
      },
      eyeContact: 78,
      sentiment: {
        positive: 65,
        negative: 10,
        neutral: 25
      }
    },
    strengths: [
      'Excellent speaking pace - clear and engaging',
      'Strong eye contact maintaining audience connection',
      'Positive energy throughout the presentation'
    ],
    improvements: [
      'Reduce filler words by pausing instead of using "um"',
      'Vary your tone more for emphasis',
      'Use more concrete examples to support points'
    ],
    transcript: 'This is where the full transcript would appear...'
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
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
            <h1 className="text-4xl font-bold">Session Report</h1>
          </div>
          <div className="text-gray-400">
            {new Date(report.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 mb-8 text-center"
        >
          <h2 className="text-2xl mb-4">Overall Performance</h2>
          <div className={`text-7xl font-bold mb-2 ${getScoreColor(report.overallScore)}`}>
            {report.overallScore}%
          </div>
          <p className="text-gray-300">Great job! You're improving.</p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Duration</span>
            </div>
            <p className="text-2xl font-bold">{formatDuration(report.duration)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">Pace</span>
            </div>
            <p className="text-2xl font-bold">{report.metrics.averagePace} WPM</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Eye Contact</span>
            </div>
            <p className="text-2xl font-bold">{report.metrics.eyeContact}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400">Filler Words</span>
            </div>
            <p className="text-2xl font-bold">{report.metrics.fillerWords.count}</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-400" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Areas for Improvement</h3>
            <ul className="space-y-3">
              {report.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Filler Words Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gray-800/50 backdrop-blur rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Filler Words Used</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {report.metrics.fillerWords.words.map((item, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-gray-400 text-sm">{item.word}</p>
                <p className="text-2xl font-bold text-orange-400">{item.count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link
            href="/practice"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg transition-shadow"
          >
            Practice Again
          </Link>
          <button className="px-6 py-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            Download Report
          </button>
        </motion.div>
      </div>
    </div>
  );
}