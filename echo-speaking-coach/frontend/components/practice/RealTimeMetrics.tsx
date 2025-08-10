import { motion } from 'framer-motion';
import { TrendingUp, Eye, MessageSquare, Gauge } from 'lucide-react';
import PacingChart from './PacingChart';
import FillerWordCounter from './FillerWordCounter';
import SentimentDisplay from './SentimentDisplay';

interface Props {
  pace: number;
  fillerWords: { word: string; count: number }[];
  eyeContact: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  isRecording: boolean;
}

export default function RealTimeMetrics({
  pace,
  fillerWords,
  eyeContact,
  sentiment,
  isRecording
}: Props) {
  const getPaceColor = (wpm: number) => {
    if (wpm < 130) return 'text-yellow-400';
    if (wpm > 170) return 'text-orange-400';
    return 'text-green-400';
  };

  const getEyeContactColor = (score: number) => {
    if (score < 50) return 'text-red-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Speaking Pace</span>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getPaceColor(pace)}`}>
            {pace} <span className="text-sm text-gray-400">WPM</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Optimal: 130-170 WPM
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Eye Contact</span>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getEyeContactColor(eyeContact)}`}>
            {Math.round(eyeContact)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: Above 70%
          </div>
        </motion.div>
      </div>

      {/* Pacing Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Pacing Trend
        </h3>
        <PacingChart pace={pace} isRecording={isRecording} />
      </motion.div>

      {/* Filler Words */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-400" />
          Filler Words
        </h3>
        <FillerWordCounter words={fillerWords} />
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
        <SentimentDisplay sentiment={sentiment} />
      </motion.div>
    </div>
  );
}