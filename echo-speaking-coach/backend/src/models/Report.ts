import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  sessionDate: Date;
  duration: number;
  metrics: {
    averagePace: number;
    fillerWords: {
      count: number;
      words: { word: string; count: number }[];
    };
    eyeContact: number;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  transcript: string;
  overallScore: number;
  improvements: string[];
  strengths: string[];
}

const ReportSchema = new Schema<IReport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  metrics: {
    averagePace: Number,
    fillerWords: {
      count: Number,
      words: [{
        word: String,
        count: Number
      }]
    },
    eyeContact: Number,
    sentiment: {
      positive: Number,
      negative: Number,
      neutral: Number
    }
  },
  transcript: String,
  overallScore: Number,
  improvements: [String],
  strengths: [String]
});

export default mongoose.model<IReport>('Report', ReportSchema);