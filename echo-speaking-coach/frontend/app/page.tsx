'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mic, BarChart3, Eye, Brain, ArrowRight, LogIn, 
  Sparkles, Zap, Shield, Users, Trophy, Target, ChevronDown,
  Play, Headphones, Activity, Star
} from 'lucide-react';
import { useAppStore } from '@/store';

// Floating animation component
const FloatingElement = ({ children, delay = 0, duration = 3 }: any) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated background grid
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 50;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const theme = useAppStore((state) => state.settings.theme);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
    // Still apply theme from store if it exists
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleStartPracticing = () => {
    if (user) {
      router.push('/practice');
    } else {
      sessionStorage.setItem('intendedAction', 'practice');
      router.push('/login');
    }
  };

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: 'Real-time Speech Analysis',
      description: 'Get instant feedback on your pacing and filler words',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Eye Contact Tracking',
      description: 'Improve your audience connection with eye contact monitoring',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description: 'Receive personalized recommendations to enhance your skills',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed reports',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Active Users' },
    { value: 95, suffix: '%', label: 'Satisfaction Rate' },
    { value: 500000, suffix: '+', label: 'Sessions Completed' },
    { value: 4.9, suffix: '/5', label: 'Average Rating' }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-all duration-500 overflow-hidden">
      <AnimatedGrid />
      
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-50 container mx-auto px-4 py-6"
      >
        <div className="flex justify-between items-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 rounded-2xl px-6 py-4 border border-white/20 dark:border-gray-700/20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50"
              />
              <Mic className="relative w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Echo
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <Link href="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
                  >
                    Profile
                  </motion.button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          style={{ scale: scaleProgress, opacity: opacityProgress }}
          className="text-center mb-16 relative"
        >
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <FloatingElement delay={0} duration={4}>
              <Sparkles className="absolute top-10 left-10 w-6 h-6 text-purple-400 opacity-60" />
            </FloatingElement>
            <FloatingElement delay={1} duration={5}>
              <Zap className="absolute top-20 right-20 w-8 h-8 text-yellow-400 opacity-60" />
            </FloatingElement>
            <FloatingElement delay={2} duration={3.5}>
              <Star className="absolute bottom-10 left-20 w-5 h-5 text-pink-400 opacity-60" />
            </FloatingElement>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl"
              />
              <h1 className="relative text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-300% animate-gradient">
                Echo
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6 font-light"
          >
            Your AI-Powered <span className="font-semibold text-purple-600 dark:text-purple-400">Public Speaking</span> Coach
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Master the art of public speaking with real-time feedback, 
            AI-driven insights, and personalized coaching
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartPracticing}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-lg font-semibold overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                {user ? 'Continue Practicing' : 'Start Practicing Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-purple-600 dark:border-purple-400 rounded-full text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>
          
          {!user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-500 dark:text-gray-400 text-sm"
            >
              No credit card required • Free to start
            </motion.p>
          )}

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, y: { duration: 1.5, repeat: Infinity } }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-12"
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${feature.color.split(' ')[1]} 0%, ${feature.color.split(' ')[3]} 100%)`
                }}
              />
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-20 relative"
        >
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 rounded-3xl blur-3xl"
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Ready to Transform Your Speaking Skills?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of speakers who have improved their confidence and delivery with Echo
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartPracticing}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-shadow"
            >
              Get Started for Free
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 300% 300%;
        }
        .bg-300\% { background-size: 300% 300%; }
      `}</style>
    </div>
  );
}