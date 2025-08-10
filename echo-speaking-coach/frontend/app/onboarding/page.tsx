'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Mic, Target, Clock, Brain, ArrowRight, ArrowLeft, 
  CheckCircle, User, Settings, Trophy 
} from 'lucide-react';
import { useAppStore } from '@/store';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const updateUser = useAppStore((state) => state.updateUser);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    experience: '',
    goals: [] as string[],
    targetPace: 150,
    weeklyGoal: 5,
    preferredTime: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const steps = [
    {
      title: "Welcome to Echo!",
      subtitle: "Let's personalize your experience",
      icon: <User className="w-16 h-16" />
    },
    {
      title: "Your Speaking Experience",
      subtitle: "Help us understand your current level",
      icon: <Mic className="w-16 h-16" />
    },
    {
      title: "Set Your Goals",
      subtitle: "What would you like to improve?",
      icon: <Target className="w-16 h-16" />
    },
    {
      title: "Practice Schedule",
      subtitle: "When do you prefer to practice?",
      icon: <Clock className="w-16 h-16" />
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to start your journey",
      icon: <Trophy className="w-16 h-16" />
    }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to public speaking' },
    { id: 'intermediate', label: 'Intermediate', description: 'Some experience presenting' },
    { id: 'advanced', label: 'Advanced', description: 'Regular speaker looking to refine' }
  ];

  const goalOptions = [
    { id: 'pace', label: 'Improve Speaking Pace', icon: '⚡' },
    { id: 'fillers', label: 'Reduce Filler Words', icon: '🎯' },
    { id: 'confidence', label: 'Build Confidence', icon: '💪' },
    { id: 'eye-contact', label: 'Better Eye Contact', icon: '👁️' },
    { id: 'structure', label: 'Improve Structure', icon: '📝' },
    { id: 'engagement', label: 'Increase Engagement', icon: '🎤' }
  ];

  const timePreferences = [
    { id: 'morning', label: 'Morning', time: '6 AM - 12 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '12 PM - 6 PM' },
    { id: 'evening', label: 'Evening', time: '6 PM - 12 AM' },
    { id: 'flexible', label: 'Flexible', time: 'Anytime' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Save user preferences
    updateSettings({
      targetPace: onboardingData.targetPace,
      weeklyGoal: onboardingData.weeklyGoal
    });

    // Update user profile with onboarding data
    if (user) {
      updateUser({
        ...user,
        onboarded: true,
        experience: onboardingData.experience,
        goals: onboardingData.goals,
        preferredTime: onboardingData.preferredTime
      });
    }

    toast.success('Welcome to Echo! Let\'s start practicing!');
    router.push('/dashboard');
  };

  const toggleGoal = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center text-purple-400">
              {steps[0].icon}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Welcome, {user?.name}! 👋
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Echo is your personal AI coach for mastering public speaking. 
              Let's take a few moments to customize your experience.
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Real-time Feedback
                </h3>
                <p className="text-sm text-gray-400">
                  Get instant insights on pace, filler words, and eye contact
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Track Progress
                </h3>
                <p className="text-sm text-gray-400">
                  Monitor your improvement with detailed analytics
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Unlock Achievements
                </h3>
                <p className="text-sm text-gray-400">
                  Earn badges and compete on the leaderboard
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 flex justify-center text-purple-400">
              {steps[1].icon}
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              What's your experience level?
            </h2>
            <div className="space-y-4 max-w-lg mx-auto">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setOnboardingData({ ...onboardingData, experience: level.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    onboardingData.experience === level.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <h3 className="font-semibold mb-1">{level.label}</h3>
                  <p className="text-sm text-gray-400">{level.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 flex justify-center text-purple-400">
              {steps[2].icon}
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              What would you like to improve?
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Select all that apply
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    onboardingData.goals.includes(goal.id)
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 flex justify-center text-purple-400">
              {steps[3].icon}
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Set Your Practice Schedule
            </h2>
            
            <div className="max-w-lg mx-auto space-y-6">
              {/* Weekly Goal */}
              <div>
                <label className="block text-gray-300 mb-3">
                  Weekly practice goal
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={onboardingData.weeklyGoal}
                    onChange={(e) => setOnboardingData({ 
                      ...onboardingData, 
                      weeklyGoal: Number(e.target.value) 
                    })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-purple-400 min-w-[60px]">
                    {onboardingData.weeklyGoal} days
                  </span>
                </div>
              </div>

              {/* Target Pace */}
              <div>
                <label className="block text-gray-300 mb-3">
                  Target speaking pace
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max="200"
                    value={onboardingData.targetPace}
                    onChange={(e) => setOnboardingData({ 
                      ...onboardingData, 
                      targetPace: Number(e.target.value) 
                    })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-purple-400 min-w-[80px]">
                    {onboardingData.targetPace} WPM
                  </span>
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-gray-300 mb-3">
                  Preferred practice time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timePreferences.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setOnboardingData({ 
                        ...onboardingData, 
                        preferredTime: time.id 
                      })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        onboardingData.preferredTime === time.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium">{time.label}</div>
                      <div className="text-xs text-gray-400">{time.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center text-purple-400">
              {steps[4].icon}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              You're All Set! 🎉
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your personalized speaking journey begins now. 
              Let's start with your first practice session!
            </p>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold mb-4">Your Personalized Plan</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Practice {onboardingData.weeklyGoal} times per week</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Target pace: {onboardingData.targetPace} WPM</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Focus on {onboardingData.goals.length} improvement areas</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  completeOnboarding();
                  router.push('/practice');
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Start First Session
              </button>
              <button
                onClick={completeOnboarding}
                className="px-8 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep
                        ? 'bg-purple-600'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 min-h-[500px] flex flex-col justify-between"
          >
            <div>{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < steps.length - 1 && (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !onboardingData.experience) ||
                    (currentStep === 2 && onboardingData.goals.length === 0) ||
                    (currentStep === 3 && !onboardingData.preferredTime)
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={completeOnboarding}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}