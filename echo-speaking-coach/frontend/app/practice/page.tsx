'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import RealTimeMetrics from '@/components/practice/RealTimeMetrics';
import { Play, Square, Mic, MicOff, Camera, CameraOff, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store';

// Dynamically import webcam to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

interface Metrics {
  pace: number;
  fillerWords: { word: string; count: number }[];
  eyeContact: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  transcript: string;
}

// Enhanced filler words list with variations
const FILLER_WORDS = [
  'um', 'umm', 'ummm',
  'uh', 'uhh', 'uhhh',
  'er', 'err', 'errr',
  'ah', 'ahh', 'ahhh',
  'like', 'literally',
  'you know', 'you see',
  'basically', 'actually',
  'sort of', 'kind of',
  'i mean', 'i guess',
  'right', 'okay', 'so',
  'well', 'anyway',
  'whatever', 'obviously'
];

export default function PracticePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    pace: 0,
    fillerWords: [],
    eyeContact: 0,
    sentiment: { positive: 0, negative: 0, neutral: 100 },
    transcript: ''
  });
  const [sessionTime, setSessionTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [eyeContactSamples, setEyeContactSamples] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const [paceHistory, setPaceHistory] = useState<number[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [fillerWordCounts, setFillerWordCounts] = useState<Map<string, number>>(new Map());
  
  const webcamRef = useRef<any>(null);
  const socket = useSocket();
  const { startRecognition, stopRecognition, transcript, isListening } = useSpeechRecognition();
  const { modelsLoaded, detectFace } = useFaceDetection();
  const intervalRef = useRef<NodeJS.Timeout>();
  const metricsIntervalRef = useRef<NodeJS.Timeout>();
  const eyeTrackingIntervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<Date | null>(null);
  const lastProcessedLength = useRef(0);

  // Authentication check
  useEffect(() => {
    if (!user) {
      router.push('/login');
      toast.error('Please login to start practicing');
    }
  }, [user, router]);

  if (!user) return null;

  // Enhanced filler word detection
  const detectFillerWords = (text: string) => {
    if (!text) return;
    
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    // Create a new map for counting
    const newCounts = new Map(fillerWordCounts);
    
    // Check each filler word/phrase
    FILLER_WORDS.forEach(filler => {
      if (filler.includes(' ')) {
        // Multi-word fillers (like "you know")
        const regex = new RegExp(filler, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          const currentCount = newCounts.get(filler) || 0;
          newCounts.set(filler, currentCount + matches.length);
        }
      } else {
        // Single word fillers
        words.forEach(word => {
          // Remove punctuation for better matching
          const cleanWord = word.replace(/[.,!?;:]/g, '');
          if (cleanWord === filler || cleanWord.startsWith(filler)) {
            const currentCount = newCounts.get(filler) || 0;
            newCounts.set(filler, currentCount + 1);
          }
        });
      }
    });
    
    setFillerWordCounts(newCounts);
  };

  // Process transcript changes with better filler detection
  useEffect(() => {
    if (transcript && transcript.length > lastProcessedLength.current) {
      // Get only the new portion of transcript
      const newPortion = transcript.substring(lastProcessedLength.current);
      
      // Detect filler words in the new portion
      detectFillerWords(newPortion);
      
      // Update last processed length
      lastProcessedLength.current = transcript.length;
      
      // Update word count
      const words = transcript.trim().split(/\s+/);
      const newWordCount = words.filter(word => word.length > 0).length;
      
      if (newWordCount > wordCount) {
        setWordCount(newWordCount);
        setIsSpeaking(true);
        setSilenceTimer(0);
        
        // Calculate WPM
        if (startTimeRef.current) {
          const elapsedMinutes = (Date.now() - startTimeRef.current.getTime()) / 60000;
          if (elapsedMinutes > 0.1) {
            const currentPace = Math.round(newWordCount / elapsedMinutes);
            setPaceHistory(prev => [...prev.slice(-19), currentPace]);
          }
        }
      }
    }
    
    // Update the displayed transcript (both final and interim for faster feedback)
    setMetrics(prev => ({
      ...prev,
      transcript: transcript || interimTranscript || ''
    }));
  }, [transcript, interimTranscript, wordCount]);

  // Monitor for silence
  useEffect(() => {
    if (isRecording && isMicOn) {
      const silenceInterval = setInterval(() => {
        setSilenceTimer(prev => {
          const newTimer = prev + 1;
          if (newTimer >= 2) { // Reduced from 3 to 2 seconds for faster response
            setIsSpeaking(false);
          }
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(silenceInterval);
    }
  }, [isRecording, isMicOn]);

  // Face detection for eye contact
  useEffect(() => {
    if (isRecording && isCameraOn && webcamRef.current && modelsLoaded) {
      const videoElement = webcamRef.current.video;
      
      if (videoElement) {
        eyeTrackingIntervalRef.current = setInterval(async () => {
          const detection = await detectFace(videoElement);
          
          setEyeContactSamples(prev => {
            const samples = [...prev, detection.faceDetected ? detection.eyeContact : 0];
            return samples.slice(-10);
          });
        }, 500);

        return () => {
          if (eyeTrackingIntervalRef.current) {
            clearInterval(eyeTrackingIntervalRef.current);
          }
        };
      }
    } else if (!isCameraOn) {
      setEyeContactSamples([0]);
    }
  }, [isRecording, isCameraOn, modelsLoaded, detectFace]);

  // Calculate metrics with improved filler word display
  useEffect(() => {
    if (isRecording) {
      metricsIntervalRef.current = setInterval(() => {
        const currentTime = new Date();
        const elapsedMinutes = startTimeRef.current 
          ? Math.max(0.1, (currentTime.getTime() - startTimeRef.current.getTime()) / 60000)
          : 0.1;

        setMetrics(prev => {
          // Calculate current pace
          let currentPace = 0;
          if (wordCount > 0 && elapsedMinutes > 0) {
            currentPace = Math.round(wordCount / elapsedMinutes);
          }

          // Convert filler word counts to array format for display
          const fillerWordsArray = Array.from(fillerWordCounts.entries())
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 5) // Show top 5
            .map(([word, count]) => ({ word, count }));

          // Calculate average eye contact
          const avgEyeContact = eyeContactSamples.length > 0
            ? Math.round(eyeContactSamples.reduce((a, b) => a + b, 0) / eyeContactSamples.length)
            : 0;

          // Dynamic sentiment based on multiple factors
          let sentiment = { positive: 33, negative: 33, neutral: 34 };
          
          if (currentPace > 0) {
            const idealPaceRange = currentPace >= 130 && currentPace <= 170;
            const tooFast = currentPace > 180;
            const tooSlow = currentPace < 100;
            const goodEyeContact = avgEyeContact > 60;
            const fewFillers = fillerWordsArray.length < 3;
            
            if (idealPaceRange && goodEyeContact && fewFillers) {
              sentiment = { positive: 70, negative: 5, neutral: 25 };
            } else if (idealPaceRange && (goodEyeContact || fewFillers)) {
              sentiment = { positive: 55, negative: 15, neutral: 30 };
            } else if (tooFast) {
              sentiment = { positive: 20, negative: 50, neutral: 30 };
            } else if (tooSlow) {
              sentiment = { positive: 25, negative: 35, neutral: 40 };
            } else {
              sentiment = { positive: 40, negative: 25, neutral: 35 };
            }
          }

          return {
            pace: currentPace,
            fillerWords: fillerWordsArray,
            eyeContact: avgEyeContact,
            sentiment,
            transcript: transcript || interimTranscript || prev.transcript
          };
        });
      }, 500); // Update more frequently (every 500ms instead of 1000ms)

      return () => {
        if (metricsIntervalRef.current) {
          clearInterval(metricsIntervalRef.current);
        }
      };
    }
  }, [isRecording, wordCount, transcript, interimTranscript, eyeContactSamples, fillerWordCounts]);

  // Session timer
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startSession = () => {
    if (!isMicOn) {
      toast.error('Please enable your microphone to start recording');
      return;
    }

    if (!isCameraOn) {
      toast('Recording without camera - eye contact tracking disabled', {
        icon: '⚠️',
      });
    }
    
    // Reset all metrics
    setIsRecording(true);
    startTimeRef.current = new Date();
    setWordCount(0);
    lastProcessedLength.current = 0;
    setEyeContactSamples([]);
    setSilenceTimer(0);
    setIsSpeaking(false);
    setPaceHistory([]);
    setInterimTranscript('');
    setFinalTranscript('');
    setFillerWordCounts(new Map());
    setMetrics({
      pace: 0,
      fillerWords: [],
      eyeContact: 0,
      sentiment: { positive: 0, negative: 0, neutral: 100 },
      transcript: ''
    });
    
    if (socket) {
      socket.emit('start-session');
    }
    
    startRecognition();
    toast.success('Recording started! Start speaking...');
  };

  // const endSession = () => {
  //   setIsRecording(false);
  //   startTimeRef.current = null;
    
  //   if (socket) {
  //     socket.emit('end-session');
  //   }
    
  //   stopRecognition();
  //   setSessionTime(0);
    
  //   // Show final stats
  //   const totalFillers = Array.from(fillerWordCounts.values()).reduce((a, b) => a + b, 0);
  //   if (wordCount > 0) {
  //     toast.success(`Session ended! You spoke ${wordCount} words with ${totalFillers} filler words.`);
  //   } else {
  //     toast.success('Session ended!');
  //   }
  // };

  // Add this to your existing practice page code
// Replace the existing endSession function with this enhanced version:

const endSession = () => {
  setIsRecording(false);
  
  // Calculate final metrics
  const sessionDuration = sessionTime; // in seconds
  const finalWordCount = wordCount;
  const totalFillers = Array.from(fillerWordCounts.values()).reduce((a, b) => a + b, 0);
  
  // Calculate final scores
  const paceScore = calculatePaceScore(metrics.pace);
  const fillerScore = calculateFillerScore(totalFillers, finalWordCount);
  const eyeContactScore = metrics.eyeContact;
  const overallScore = Math.round((paceScore + fillerScore + eyeContactScore) / 3);
  
  // Create session data
  const sessionData = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    duration: sessionDuration,
    wordCount: finalWordCount,
    overallScore: overallScore,
    metrics: {
      pace: metrics.pace,
      fillerWords: metrics.fillerWords,
      eyeContact: metrics.eyeContact,
      sentiment: metrics.sentiment,
      paceScore: paceScore,
      fillerScore: fillerScore,
      totalFillers: totalFillers
    },
    transcript: metrics.transcript.slice(0, 500), // Save first 500 chars to save space
    strengths: generateStrengths(paceScore, fillerScore, eyeContactScore),
    improvements: generateImprovements(paceScore, fillerScore, eyeContactScore)
  };
  
  // Save to store
  if (sessionDuration > 10 && finalWordCount > 0) { // Only save meaningful sessions
    const addSession = useAppStore.getState().addSession;
    const updateStats = useAppStore.getState().updateStats;
    const unlockAchievement = useAppStore.getState().unlockAchievement;
    
    // Add session
    addSession(sessionData);
    
    // Update user stats
    const sessions = useAppStore.getState().sessions;
    const totalSessions = sessions.length;
    const avgScore = Math.round(
      sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalSessions
    );
    
    // Calculate improvement (compare to previous session)
    let improvement = 0;
    if (sessions.length > 1) {
      const previousScore = sessions[sessions.length - 2].overallScore;
      improvement = overallScore - previousScore;
    }
    
    updateStats({
      totalSessions: totalSessions,
      averageScore: avgScore,
      improvement: improvement > 0 ? improvement : 0
    });
    
    // Check for achievements
    if (totalSessions === 1) {
      unlockAchievement('first_session');
    }
    if (overallScore >= 80) {
      unlockAchievement('score_80');
    }
    if (totalFillers === 0 && finalWordCount > 50) {
      unlockAchievement('no_fillers');
    }
    
    toast.success(`Session saved! Score: ${overallScore}%`);
  } else if (sessionDuration <= 10) {
    toast.info('Session too short to save (minimum 10 seconds)');
  }
  
  // Reset everything
  startTimeRef.current = null;
  if (socket) {
    socket.emit('end-session');
  }
  stopRecognition();
  setSessionTime(0);
};

// Helper functions to add to your practice page:

const calculatePaceScore = (pace: number): number => {
  // Ideal pace is 130-170 WPM
  if (pace >= 130 && pace <= 170) return 100;
  if (pace >= 120 && pace <= 180) return 80;
  if (pace >= 100 && pace <= 200) return 60;
  if (pace > 0) return 40;
  return 0;
};

const calculateFillerScore = (fillers: number, words: number): number => {
  if (words === 0) return 0;
  const fillerRate = (fillers / words) * 100;
  if (fillerRate === 0) return 100;
  if (fillerRate < 2) return 90;
  if (fillerRate < 5) return 70;
  if (fillerRate < 10) return 50;
  return 30;
};

const generateStrengths = (pace: number, filler: number, eye: number): string[] => {
  const strengths = [];
  if (pace >= 80) strengths.push('Excellent speaking pace');
  if (filler >= 80) strengths.push('Minimal use of filler words');
  if (eye >= 70) strengths.push('Good eye contact with audience');
  if (strengths.length === 0) strengths.push('Completed the practice session');
  return strengths;
};

const generateImprovements = (pace: number, filler: number, eye: number): string[] => {
  const improvements = [];
  if (pace < 60) improvements.push('Work on maintaining consistent pace');
  if (filler < 60) improvements.push('Reduce filler words by pausing instead');
  if (eye < 50) improvements.push('Improve eye contact with camera');
  if (improvements.length === 0) improvements.push('Keep practicing to maintain skills');
  return improvements;
};



  const toggleCamera = () => {
    if (isRecording && isCameraOn) {
      toast.error('Cannot disable camera while recording');
      return;
    }
    setIsCameraOn(!isCameraOn);
    toast(isCameraOn ? 'Camera disabled' : 'Camera enabled');
  };

  const toggleMic = () => {
    if (isRecording && isMicOn) {
      toast.error('Cannot disable microphone while recording');
      return;
    }
    setIsMicOn(!isMicOn);
    toast(isMicOn ? 'Microphone disabled' : 'Microphone enabled');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Practice Session
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono">
              {formatTime(sessionTime)}
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Face Detection Loading */}
        {!modelsLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg"
          >
            <div className="text-blue-300 text-sm flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
              <span>Loading face detection models...</span>
            </div>
          </motion.div>
        )}

        {/* Speaking Indicator with filler count */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-gray-800/50 rounded-lg flex items-center justify-center gap-3"
            >
              <div className={`flex items-center gap-2 ${isSpeaking ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span>{isSpeaking ? 'Speaking detected' : 'Waiting for speech...'}</span>
              </div>
              {wordCount > 0 && (
                <span className="text-gray-400">• {wordCount} words</span>
              )}
              {Array.from(fillerWordCounts.values()).reduce((a, b) => a + b, 0) > 0 && (
                <span className="text-orange-400">
                  • {Array.from(fillerWordCounts.values()).reduce((a, b) => a + b, 0)} fillers
                </span>
              )}
              {isListening && (
                <span className="text-green-400 text-sm">• Mic active</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning Banner */}
        <AnimatePresence>
          {(!isCameraOn || !isMicOn) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-300">
                {!isMicOn && !isCameraOn 
                  ? 'Both camera and microphone are disabled. Enable microphone to start recording.'
                  : !isMicOn 
                  ? 'Microphone is disabled. Enable it to start recording.'
                  : 'Camera is disabled. Eye contact tracking will not work.'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
          >
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
              {isCameraOn ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-full object-cover"
                  screenshotFormat="image/jpeg"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                  <CameraOff className="w-16 h-16 text-gray-600 mb-2" />
                  <p className="text-gray-500">Camera is disabled</p>
                </div>
              )}
              
              {/* Recording indicator */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mic indicator */}
              {!isMicOn && (
                <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Muted</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCamera}
                disabled={isRecording && isCameraOn}
                className={`p-3 rounded-full transition-colors ${
                  isCameraOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                } ${isRecording && isCameraOn ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isCameraOn ? <Camera /> : <CameraOff />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMic}
                disabled={isRecording && isMicOn}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                } ${isRecording && isMicOn ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isRecording ? endSession : startSession}
                className={`p-4 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRecording ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
            </div>

            {/* Transcript */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Live Transcript</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 h-32 overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {metrics.transcript || 'Start speaking to see your transcript...'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Metrics Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <RealTimeMetrics
              pace={metrics.pace}
              fillerWords={metrics.fillerWords}
              eyeContact={metrics.eyeContact}
              sentiment={metrics.sentiment}
              isRecording={isRecording}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}