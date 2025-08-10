import { Router } from 'express';

const router: Router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reports endpoint' });
});

router.get('/stats', (req, res) => {
  res.json({ message: 'Stats endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Single report endpoint', id: req.params.id });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create report endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete report endpoint', id: req.params.id });
});

export default router;   // Change this line from "export default router"