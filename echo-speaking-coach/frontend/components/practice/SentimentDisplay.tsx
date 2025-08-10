'use client';

import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';

interface Props {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export default function SentimentDisplay({ sentiment }: Props) {
  const dominantSentiment = Object.entries(sentiment).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

  const getSentimentIcon = () => {
    switch (dominantSentiment) {
      case 'positive':
        return <Smile className="w-8 h-8 text-green-400" />;
      case 'negative':
        return <Frown className="w-8 h-8 text-red-400" />;
      default:
        return <Meh className="w-8 h-8 text-gray-400" />;
    }
  };

  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      {/* Icon and Dominant Sentiment */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: dominantSentiment === 'positive' ? [0, 10, -10, 0] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {getSentimentIcon()}
        </motion.div>
      </div>

      {/* Sentiment Bars */}
      <div className="space-y-3">
        {Object.entries(sentiment).map(([type, value]) => (
          <div key={type}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400 capitalize">{type}</span>
              <span className="text-sm font-semibold text-gray-300">{value}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${getSentimentColor(type)}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-gray-800/50 rounded-lg"
      >
        <p className="text-sm text-gray-300">
          {dominantSentiment === 'positive' && 
            "Great energy! Your positive tone is engaging the audience."
          }
          {dominantSentiment === 'negative' && 
            "Consider adding more enthusiasm to better connect with your audience."
          }
          {dominantSentiment === 'neutral' && 
            "Good balanced tone. Consider varying your emotional expression for impact."
          }
        </p>
      </motion.div>
    </div>
  );
}