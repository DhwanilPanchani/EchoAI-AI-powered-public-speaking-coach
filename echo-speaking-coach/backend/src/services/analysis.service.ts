interface AnalysisResult {
    wordCount: number;
    fillerWords: Map<string, number>;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  }
  
  const FILLER_WORDS = [
    'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'actually', 
    'basically', 'literally', 'right', 'well', 'I mean', 'sort of', 'kind of'
  ];
  
  export function analyzeSpeech(text: string): AnalysisResult {
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    
    // Count filler words
    const fillerWords = new Map<string, number>();
    
    // Check for single-word fillers
    words.forEach(word => {
      const cleanWord = word.replace(/[.,!?;]/g, '');
      if (FILLER_WORDS.includes(cleanWord)) {
        fillerWords.set(cleanWord, (fillerWords.get(cleanWord) || 0) + 1);
      }
    });
    
    // Check for multi-word fillers
    const textLower = text.toLowerCase();
    FILLER_WORDS.filter(filler => filler.includes(' ')).forEach(filler => {
      const matches = textLower.match(new RegExp(filler, 'g'));
      if (matches) {
        fillerWords.set(filler, matches.length);
      }
    });
    
    // Simple sentiment analysis (you can integrate a more sophisticated service)
    const sentiment = analyzeSentiment(text);
    
    return {
      wordCount,
      fillerWords,
      sentiment
    };
  }
  
  function analyzeSentiment(text: string): { positive: number; negative: number; neutral: number } {
    // This is a simplified sentiment analysis
    // In production, use a service like Azure Text Analytics or AWS Comprehend
    
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'happy', 'excited'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'angry', 'frustrated', 'disappointed'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positive = 0;
    let negative = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positive++;
      if (negativeWords.includes(word)) negative++;
    });
    
    const total = words.length;
    const positiveScore = (positive / total) * 100;
    const negativeScore = (negative / total) * 100;
    const neutralScore = 100 - positiveScore - negativeScore;
    
    return {
      positive: Math.round(positiveScore),
      negative: Math.round(negativeScore),
      neutral: Math.round(neutralScore)
    };
  }