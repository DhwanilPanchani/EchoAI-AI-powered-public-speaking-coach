import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Router } from 'express';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create auth routes inline
const authRouter = Router();
authRouter.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', body: req.body });
});
authRouter.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', body: req.body });
});
authRouter.get('/profile', (req, res) => {
  res.json({ message: 'Profile endpoint' });
});

// Create report routes inline
const reportRouter = Router();
reportRouter.get('/', (req, res) => {
  res.json({ message: 'Get all reports' });
});
reportRouter.get('/stats', (req, res) => {
  res.json({ message: 'Get stats' });
});
reportRouter.get('/:id', (req, res) => {
  res.json({ message: 'Get report by id', id: req.params.id });
});
reportRouter.post('/', (req, res) => {
  res.json({ message: 'Create report', body: req.body });
});
reportRouter.delete('/:id', (req, res) => {
  res.json({ message: 'Delete report', id: req.params.id });
});

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/reports', reportRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ Server started successfully');
  console.log(`📡 Test: http://localhost:${PORT}/health`);
});