'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  score: number; // 0-100
  isTracking: boolean;
}

export default function EyeContactIndicator({ score, isTracking }: Props) {
  const getColor = () => {
    if (score >= 70) return '#10B981'; // green
    if (score >= 50) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const getMessage = () => {
    if (!isTracking) return 'Eye tracking disabled';
    if (score >= 70) return 'Excellent eye contact!';
    if (score >= 50) return 'Try to look forward more';
    return 'Focus on the camera';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress */}
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              strokeDasharray: 351.86,
              strokeDashoffset: 0
            }}
          />
        </svg>
        
        {/* Center Icon and Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isTracking ? (
            <Eye className="w-8 h-8 mb-1" style={{ color: getColor() }} />
          ) : (
            <EyeOff className="w-8 h-8 mb-1 text-gray-500" />
          )}
          <span className="text-2xl font-bold" style={{ color: getColor() }}>
            {Math.round(score)}%
          </span>
        </div>
      </div>

      {/* Message */}
      <motion.p
        key={getMessage()}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-sm text-gray-400"
      >
        {getMessage()}
      </motion.p>
    </div>
  );
}