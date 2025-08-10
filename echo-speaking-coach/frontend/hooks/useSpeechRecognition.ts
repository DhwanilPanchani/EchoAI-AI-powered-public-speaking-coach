// import { useState, useEffect, useRef } from 'react';

// interface SpeechRecognitionHook {
//   transcript: string;
//   isListening: boolean;
//   startRecognition: () => void;
//   stopRecognition: () => void;
//   resetTranscript: () => void;
// }

// export function useSpeechRecognition(): SpeechRecognitionHook {
//   const [transcript, setTranscript] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
//       if (SpeechRecognition) {
//         recognitionRef.current = new SpeechRecognition();
//         recognitionRef.current.continuous = true;
//         recognitionRef.current.interimResults = true;
//         recognitionRef.current.lang = 'en-US';

//         recognitionRef.current.onresult = (event: any) => {
//           let finalTranscript = '';
//           let interimTranscript = '';

//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//               finalTranscript += transcript + ' ';
//             } else {
//               interimTranscript += transcript;
//             }
//           }

//           if (finalTranscript) {
//             setTranscript(prev => prev + finalTranscript);
//           }
//         };

//         recognitionRef.current.onerror = (event: any) => {
//           console.error('Speech recognition error:', event.error);
//           setIsListening(false);
//         };

//         recognitionRef.current.onend = () => {
//           setIsListening(false);
//         };
//       }
//     }
//   }, []);

//   const startRecognition = () => {
//     if (recognitionRef.current && !isListening) {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const stopRecognition = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const resetTranscript = () => {
//     setTranscript('');
//   };

//   return {
//     transcript,
//     isListening,
//     startRecognition,
//     stopRecognition,
//     resetTranscript
//   };
// }








import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startRecognition: () => void;
  stopRecognition: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).webkitSpeechRecognition || 
        (window as any).SpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        // Increase the max silence period
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
            setError(null); // Clear any previous errors
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          const errorType = event.error;
          
          // Handle different error types
          switch (errorType) {
            case 'no-speech':
              // This is normal - user just didn't speak
              // Don't log this as an error, just restart if needed
              if (isListening) {
                // Auto-restart recognition after no-speech
                restartTimeoutRef.current = setTimeout(() => {
                  if (recognitionRef.current && isListening) {
                    try {
                      recognitionRef.current.start();
                    } catch (e) {
                      // Already started, ignore
                    }
                  }
                }, 100);
              }
              break;
              
            case 'audio-capture':
              console.error('Microphone not available');
              setError('Microphone not available. Please check your microphone settings.');
              setIsListening(false);
              break;
              
            case 'not-allowed':
              console.error('Microphone permission denied');
              setError('Microphone permission denied. Please allow microphone access.');
              setIsListening(false);
              break;
              
            case 'network':
              console.error('Network error');
              setError('Network error occurred. Please check your connection.');
              setIsListening(false);
              break;
              
            case 'aborted':
              // User stopped the recognition, this is fine
              break;
              
            default:
              // Only log unexpected errors
              if (errorType !== 'aborted') {
                console.warn('Speech recognition issue:', errorType);
              }
          }
        };
        
        recognitionRef.current.onend = () => {
          // If we're supposed to be listening, restart
          if (isListening) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // If it fails to restart, stop listening
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
        
        recognitionRef.current.onstart = () => {
          setError(null);
        };
      } else {
        setError('Speech recognition is not supported in your browser.');
      }
    }
    
    // Cleanup
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [isListening]);
  
  const startRecognition = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        // Clear any previous errors
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setError('Failed to start speech recognition. Please try again.');
      }
    }
  }, [isListening]);
  
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        setIsListening(false);
        recognitionRef.current.stop();
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
      } catch (e) {
        // Ignore errors when stopping
      }
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);
  
  return {
    transcript,
    isListening,
    startRecognition,
    stopRecognition,
    resetTranscript,
    error
  };
}