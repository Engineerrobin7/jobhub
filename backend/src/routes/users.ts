import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import UserModel from '@/models/User';

const router = Router();

router.use(requireAuth);

router.get('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await UserModel.getUserProfile(req.user!.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

router.put('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await UserModel.updateUserProfile(req.user!.id, req.body);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

router.put('/password', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await UserModel.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/analytics', async (_req: AuthenticatedRequest, res) => {
  // Placeholder analytics
  res.json({ success: true, data: { savedJobs: 0, applications: 0 } });
});

export default router;


