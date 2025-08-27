import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { NotFoundError } from '@/utils/errors';
import JobModel from '@/models/Job';

const router = Router();

// In-memory bookmarks per user for MVP. Replace with DB later.
const userIdToBookmarks = new Map<string, Set<string>>();

router.use(requireAuth);

router.get('/', (req: AuthenticatedRequest, res) => {
  const set = userIdToBookmarks.get(req.user!.id) || new Set<string>();
  res.json({ success: true, data: Array.from(set) });
});

router.post('/:jobId', async (req: AuthenticatedRequest, res, next) => {
  try {
    const job = await JobModel.findById(req.params.jobId);
    if (!job) throw new NotFoundError('Job not found');
    const set = userIdToBookmarks.get(req.user!.id) || new Set<string>();
    set.add(req.params.jobId);
    userIdToBookmarks.set(req.user!.id, set);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:jobId', (req: AuthenticatedRequest, res) => {
  const set = userIdToBookmarks.get(req.user!.id) || new Set<string>();
  set.delete(req.params.jobId);
  userIdToBookmarks.set(req.user!.id, set);
  res.json({ success: true });
});

export default router;


