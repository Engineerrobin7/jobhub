import { Router } from 'express';
import { requireAuth, requireAdmin } from '@/middleware/auth';
import JobModel from '@/models/Job';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await JobModel.getJobStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

router.get('/jobs', async (req, res, next) => {
  try {
    const data = await JobModel.findWithFilters(req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.put('/jobs/:id', async (req, res, next) => {
  try {
    const job = await JobModel.update(req.params.id, req.body);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

router.delete('/jobs/:id', async (req, res, next) => {
  try {
    await JobModel.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;


