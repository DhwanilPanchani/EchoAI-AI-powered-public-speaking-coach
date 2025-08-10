'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  pace: number;
  isRecording: boolean;
}

export default function PacingChart({ pace, isRecording }: Props) {
  const [data, setData] = useState<{ time: string; pace: number }[]>([]);

  useEffect(() => {
    if (isRecording && pace > 0) {
      const newDataPoint = {
        time: new Date().toLocaleTimeString('en-US', { 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        pace
      };

      setData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points
        return updated.slice(-20);
      });
    }
  }, [pace, isRecording]);

  useEffect(() => {
    if (!isRecording) {
      setData([]);
    }
  }, [isRecording]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <p className="text-white text-sm">{`${payload[0].value} WPM`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              domain={[0, 250]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={130} 
              stroke="#10B981" 
              strokeDasharray="5 5" 
              label={{ value: "Min Optimal", fill: "#10B981", fontSize: 10 }}
            />
            <ReferenceLine 
              y={170} 
              stroke="#10B981" 
              strokeDasharray="5 5" 
              label={{ value: "Max Optimal", fill: "#10B981", fontSize: 10 }}
            />
            <Line 
              type="monotone" 
              dataKey="pace" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 4 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          {isRecording ? 'Waiting for data...' : 'Start recording to see pacing chart'}
        </div>
      )}
    </div>
  );
}