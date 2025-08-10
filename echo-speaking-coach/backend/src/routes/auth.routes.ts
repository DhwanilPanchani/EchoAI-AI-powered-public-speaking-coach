// import { Router } from 'express';

// const router: Router = Router();

// router.post('/register', (req, res) => {
//   res.json({ message: 'Register endpoint' });
// });

// router.post('/login', (req, res) => {
//   res.json({ message: 'Login endpoint' });
// });

// router.get('/profile', (req, res) => {
//   res.json({ message: 'Profile endpoint' });
// });

// export default router;



import { Router } from 'express';

const router = Router();

// Mock user database (in production, use real database)
const users: any[] = [
  {
    id: '1',
    email: 'demo@echo.ai',
    password: 'demo123', // In production, hash passwords!
    name: 'Demo User'
  }
];

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password, // Hash in production!
    name
  };
  
  users.push(newUser);
  
  res.json({
    token: 'mock-jwt-token-' + newUser.id,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    token: 'mock-jwt-token-' + user.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

router.get('/profile', (req, res) => {
  // Mock profile - in production, verify JWT token
  res.json({
    id: '1',
    email: 'demo@echo.ai',
    name: 'Demo User'
  });
});

export = router;