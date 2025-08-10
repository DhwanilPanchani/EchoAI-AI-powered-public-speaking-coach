import authRoutes from './routes/auth.routes';
import reportRoutes from './routes/report.routes';

console.log('Type of authRoutes:', typeof authRoutes);
console.log('authRoutes:', authRoutes);
console.log('Is authRoutes a function?', typeof authRoutes === 'function');

console.log('\nType of reportRoutes:', typeof reportRoutes);
console.log('reportRoutes:', reportRoutes);
console.log('Is reportRoutes a function?', typeof reportRoutes === 'function');

// Test if they work
import express from 'express';
const app = express();

try {
  app.use('/test-auth', authRoutes);
  console.log('\n✅ authRoutes can be used with app.use()');
} catch (error) {
  console.log('\n❌ Error using authRoutes:', error);
}

try {
  app.use('/test-reports', reportRoutes);
  console.log('✅ reportRoutes can be used with app.use()');
} catch (error) {
  console.log('❌ Error using reportRoutes:', error);
}
