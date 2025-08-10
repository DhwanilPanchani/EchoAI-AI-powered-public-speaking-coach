import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Report from '../models/Report';

export const createReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const reportData = { ...req.body, userId };
    
    const report = new Report(reportData);
    await report.save();
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Failed to create report' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10 } = req.query;
    
    const reports = await Report.find({ userId })
      .sort({ sessionDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Report.countDocuments({ userId });
    
    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    const report = await Report.findOne({ _id: id, userId });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Failed to fetch report' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    const report = await Report.findOneAndDelete({ _id: id, userId });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};

export const getReportStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const stats = await Report.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          avgScore: { $avg: '$overallScore' },
          avgPace: { $avg: '$metrics.averagePace' },
          avgEyeContact: { $avg: '$metrics.eyeContact' }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalSessions: 0,
      totalDuration: 0,
      avgScore: 0,
      avgPace: 0,
      avgEyeContact: 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};