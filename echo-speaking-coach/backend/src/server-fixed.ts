import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory storage as fallback when MongoDB is not connected
interface InMemoryUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const inMemoryUsers: InMemoryUser[] = [];
let isMongoConnected = false;



// Manual database connection
const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return false;
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
    isMongoConnected = true;
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isMongoConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isMongoConnected = false;
    });
    
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('⚠️ Running with in-memory storage instead');
    return false;
  }
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors = [];
  if (password.length < 6) errors.push('Password must be at least 6 characters');
  return { valid: errors.length === 0, errors };
};

// User operations that work with both MongoDB and in-memory
const UserOperations = {
  async findOne(query: { email: string }) {
    if (isMongoConnected) {
      try {
        const User = mongoose.model('User');
        return await User.findOne(query);
      } catch (error) {
        console.error('MongoDB query failed:', error);
      }
    }
    // Fallback to in-memory
    return inMemoryUsers.find(u => u.email === query.email.toLowerCase());
  },

  async create(userData: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    if (isMongoConnected) {
      try {
        const User = mongoose.model('User');
        const user = new User({
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          name: userData.name
        });
        await user.save();
        return user;
      } catch (error) {
        console.error('MongoDB save failed:', error);
      }
    }
    
    // Fallback to in-memory
    const newUser: InMemoryUser = {
      _id: Date.now().toString(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      name: userData.name,
      createdAt: new Date()
    };
    inMemoryUsers.push(newUser);
    return newUser;
  },

  async comparePassword(user: any, password: string): Promise<boolean> {
    if (user.comparePassword && typeof user.comparePassword === 'function') {
      return await user.comparePassword(password);
    }
    // Fallback for in-memory users
    return await bcrypt.compare(password, user.password);
  },

  async findById(id: string) {
    if (isMongoConnected) {
      try {
        const User = mongoose.model('User');
        return await User.findById(id).select('-password');
      } catch (error) {
        console.error('MongoDB query failed:', error);
      }
    }
    // Fallback to in-memory
    const user = inMemoryUsers.find(u => u._id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
};

// Define Mongoose schema only if we'll use MongoDB
if (process.env.MONGODB_URI) {
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // Only create model if not already created
  if (!mongoose.models.User) {
    mongoose.model('User', UserSchema);
  }
}

// Auth middleware
const authMiddleware = async (req: any, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const user = await UserOperations.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ============ AUTH ROUTES ============

// Register with validation
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'All fields are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          name: !name ? 'Name is required' : null
        }
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        errors: { email: 'Please enter a valid email address' }
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        errors: { password: passwordValidation.errors }
      });
    }

    if (name.length < 2) {
      return res.status(400).json({ 
        message: 'Name is too short',
        errors: { name: 'Name must be at least 2 characters' }
      });
    }

    // Check if user exists
    const existingUser = await UserOperations.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        errors: { email: 'An account with this email already exists' }
      });
    }

    // Create new user
    const user = await UserOperations.create({
      email: email.toLowerCase(),
      password,
      name
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log(`✅ New user registered: ${email}`);
    console.log(`   Storage: ${isMongoConnected ? 'MongoDB' : 'In-Memory'}`);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login with validation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await UserOperations.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`Login attempt failed: User not found - ${email}`);
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await UserOperations.comparePassword(user, password);
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for ${email}`);
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email}`);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/auth/profile', authMiddleware, async (req: any, res) => {
  try {
    const user = await UserOperations.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/auth/profile', authMiddleware, async (req: any, res) => {
  try {
    const { name, bio, avatar } = req.body;
    
    // For in-memory storage
    if (!isMongoConnected) {
      const userIndex = inMemoryUsers.findIndex(u => u._id === req.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (name) {
        inMemoryUsers[userIndex].name = name;
      }
      
      res.json({
        id: inMemoryUsers[userIndex]._id,
        email: inMemoryUsers[userIndex].email,
        name: inMemoryUsers[userIndex].name
      });
    } else {
      // MongoDB update would go here
      res.json({ message: 'Profile update not implemented for MongoDB yet' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ REPORT ROUTES (Simplified) ============

// Mock reports for now
const reports: any[] = [];

app.get('/api/reports', authMiddleware, async (req: any, res) => {
  const userReports = reports.filter(r => r.userId === req.userId);
  res.json({
    reports: userReports,
    pagination: {
      page: 1,
      limit: 10,
      total: userReports.length,
      pages: 1
    }
  });
});

app.get('/api/reports/stats', authMiddleware, async (req: any, res) => {
  res.json({
    totalSessions: 0,
    totalDuration: 0,
    avgScore: 0,
    avgPace: 0,
    avgEyeContact: 0
  });
});

app.post('/api/reports', authMiddleware, async (req: any, res) => {
  const newReport = {
    id: Date.now().toString(),
    userId: req.userId,
    ...req.body
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

app.get('/api/reports/:id', authMiddleware, async (req: any, res) => {
  const report = reports.find(r => r.id === req.params.id && r.userId === req.userId);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

app.delete('/api/reports/:id', authMiddleware, async (req: any, res) => {
  const index = reports.findIndex(r => r.id === req.params.id && r.userId === req.userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Report not found' });
  }
  reports.splice(index, 1);
  res.json({ message: 'Report deleted successfully' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'MongoDB connected' : 'In-memory storage',
    usersInMemory: inMemoryUsers.length
  });
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('start-session', () => {
    socket.emit('session-started', {
      sessionId: socket.id,
      timestamp: new Date().toISOString()
    });
    console.log(`Session started for client: ${socket.id}`);
  });

  socket.on('end-session', () => {
    socket.emit('session-ended', {
      sessionId: socket.id,
      timestamp: new Date().toISOString()
    });
    console.log(`Session ended for client: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Try to connect to MongoDB
    const mongoConnected = await connectDatabase();
    
    const PORT = process.env.PORT || 5001;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Storage: ${mongoConnected ? 'MongoDB' : 'In-Memory (temporary)'}`);
      console.log(`📡 Test endpoints:`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Register: POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   Login: POST http://localhost:${PORT}/api/auth/login`);
      
      if (!mongoConnected) {
        console.log(`\n⚠️  Note: Using in-memory storage. Data will be lost on restart.`);
        console.log(`   To use MongoDB, ensure MONGODB_URI is set in .env file`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();