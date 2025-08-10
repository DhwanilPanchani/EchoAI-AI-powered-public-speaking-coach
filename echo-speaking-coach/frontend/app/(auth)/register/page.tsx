// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Mail, Lock, User, ArrowRight, Mic, Eye, EyeOff, AlertCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { authAPI } from '@/lib/api';
// import { useAppStore } from '@/store';

// interface ValidationErrors {
//   name?: string;
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
// }

// export default function RegisterPage() {
//   const router = useRouter();
//   const setAuth = useAppStore((state) => state.setAuth);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   // Email validation
//   const validateEmail = (email: string): boolean => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   // Password strength validation  
//   const validatePassword = (password: string): { valid: boolean; message: string } => {
//     if (password.length < 6) {
//       return { valid: false, message: 'Password must be at least 6 characters' };
//     }
//     // Removed strict requirements for easier testing
//     return { valid: true, message: '' };
//   };

//   // Real-time validation
//   const validateField = (field: string, value: string) => {
//     const newErrors = { ...errors };

//     switch (field) {
//       case 'name':
//         if (value.length < 2) {
//           newErrors.name = 'Name must be at least 2 characters';
//         } else {
//           delete newErrors.name;
//         }
//         break;
//       case 'email':
//         if (!validateEmail(value)) {
//           newErrors.email = 'Please enter a valid email address';
//         } else {
//           delete newErrors.email;
//         }
//         break;
//       case 'password':
//         const passwordValidation = validatePassword(value);
//         if (!passwordValidation.valid) {
//           newErrors.password = passwordValidation.message;
//         } else {
//           delete newErrors.password;
//         }
//         // Also check confirm password match if it has a value
//         if (formData.confirmPassword && value !== formData.confirmPassword) {
//           newErrors.confirmPassword = 'Passwords do not match';
//         } else if (formData.confirmPassword) {
//           delete newErrors.confirmPassword;
//         }
//         break;
//       case 'confirmPassword':
//         if (value !== formData.password) {
//           newErrors.confirmPassword = 'Passwords do not match';
//         } else {
//           delete newErrors.confirmPassword;
//         }
//         break;
//     }

//     setErrors(newErrors);
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//     // Validate on change for better UX
//     if (value) {
//       validateField(field, value);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Final validation
//     const validationErrors: ValidationErrors = {};
    
//     if (formData.name.length < 2) {
//       validationErrors.name = 'Name must be at least 2 characters';
//     }
    
//     if (!validateEmail(formData.email)) {
//       validationErrors.email = 'Please enter a valid email address';
//     }
    
//     const passwordValidation = validatePassword(formData.password);
//     if (!passwordValidation.valid) {
//       validationErrors.password = passwordValidation.message;
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       validationErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error('Please fix the errors before submitting');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await authAPI.register({
//         name: formData.name,
//         email: formData.email.toLowerCase(),
//         password: formData.password
//       });
      
//       const { token, user } = response.data;
      
//       // Store auth data
//       setAuth(user, token);
      
//       toast.success('Account created successfully! Welcome to Echo!');
      
//       // Redirect to onboarding for new users
//       router.push('/onboarding');
//     } catch (error: any) {
//       console.error('Registration error:', error);
      
//       // Handle server-side validation errors
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
      
//       toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-2">
//             <Mic className="w-10 h-10 text-purple-400" />
//             <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
//               Echo
//             </h1>
//           </Link>
//           <p className="text-gray-400">Start Your Speaking Journey</p>
//         </div>

//         {/* Register Form */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
//         >
//           <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name Field */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-2">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   onBlur={(e) => validateField('name', e.target.value)}
//                   className={`w-full bg-white/5 border ${
//                     errors.name ? 'border-red-500' : 'border-white/10'
//                   } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
//                   placeholder="John Doe"
//                   required
//                 />
//               </div>
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-2">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   onBlur={(e) => validateField('email', e.target.value)}
//                   className={`w-full bg-white/5 border ${
//                     errors.email ? 'border-red-500' : 'border-white/10'
//                   } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-2">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={(e) => handleInputChange('password', e.target.value)}
//                   onBlur={(e) => validateField('password', e.target.value)}
//                   className={`w-full bg-white/5 border ${
//                     errors.password ? 'border-red-500' : 'border-white/10'
//                   } rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
              
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                   onBlur={(e) => validateField('confirmPassword', e.target.value)}
//                   className={`w-full bg-white/5 border ${
//                     errors.confirmPassword ? 'border-red-500' : 'border-white/10'
//                   } rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   Create Account
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-transparent text-gray-400">Already have an account?</span>
//               </div>
//             </div>

//             <Link
//               href="/login"
//               className="block w-full text-center py-3 mt-4 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
//             >
//               Sign In
//             </Link>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }








'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Mic, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/store';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAppStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Password strength validation  
  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    // Removed strict requirements for easier testing
    return { valid: true, message: '' };
  };

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.valid) {
          newErrors.password = passwordValidation.message;
        } else {
          delete newErrors.password;
        }
        // Also check confirm password match if it has a value
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Validate on change for better UX
    if (value) {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const validationErrors: ValidationErrors = {};
    
    if (formData.name.length < 2) {
      validationErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!validateEmail(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      validationErrors.password = passwordValidation.message;
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      const { token, user } = response.data;
      
      // Store auth data
      setAuth(user, token);
      
      toast.success('Account created successfully! Welcome to Echo!');
      
      // Redirect to onboarding for new users
      router.push('/onboarding');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle server-side validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Home Button */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Link 
              href="/" 
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-2">
              <Mic className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Echo
              </h1>
            </Link>
          </div>
          <p className="text-gray-400">Start Your Speaking Journey</p>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={(e) => validateField('name', e.target.value)}
                  className={`w-full bg-white/5 border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={(e) => validateField('email', e.target.value)}
                  className={`w-full bg-white/5 border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={(e) => validateField('password', e.target.value)}
                  className={`w-full bg-white/5 border ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  } rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  className={`w-full bg-white/5 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  } rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Already have an account?</span>
              </div>
            </div>

            <Link
              href="/login"
              className="block w-full text-center py-3 mt-4 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}