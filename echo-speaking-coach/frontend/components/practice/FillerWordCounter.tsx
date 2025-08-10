'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  words: { word: string; count: number }[];
}

export default function FillerWordCounter({ words }: Props) {
  const totalCount = words.reduce((sum, w) => sum + w.count, 0);
  
  const getColorClass = (count: number) => {
    if (count <= 2) return 'bg-green-500';
    if (count <= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColorClass = (count: number) => {
    if (count <= 2) return 'text-green-400';
    if (count <= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div>
      {/* Total Count Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Total Filler Words:</span>
          <span className={`text-2xl font-bold ${getTextColorClass(totalCount)}`}>
            {totalCount}
          </span>
        </div>
        {totalCount > 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-yellow-400 text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>High count detected</span>
          </motion.div>
        )}
      </div>

      {/* Individual Words */}
      <div className="space-y-2">
        <AnimatePresence>
          {words.length > 0 ? (
            words.map((item, index) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
              >
                <span className="text-gray-300 capitalize">{item.word}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, item.count * 10)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full ${getColorClass(item.count)}`}
                    />
                  </div>
                  <span className={`font-semibold min-w-[30px] text-right ${getTextColorClass(item.count)}`}>
                    {item.count}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No filler words detected - Great job! 🎉
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips */}
      {totalCount > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg"
        >
          <p className="text-sm text-blue-300">
            💡 <strong>Tip:</strong> Replace filler words with brief pauses. 
            This makes you sound more confident and gives your audience time to process.
          </p>
        </motion.div>
      )}
    </div>
  );
}