import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '@/models/User';
import { jwtConfig } from '@/config';
import { ValidationError, AuthenticationError } from '@/utils/errors';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) throw new ValidationError('email, name, and password are required');

    const user = await UserModel.create({ email, name, password, role: 'user' } as any);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError('email and password are required');

    const existing = await UserModel.findByEmail(email);
    if (!existing || !existing.id) throw new AuthenticationError('Invalid credentials');

    const isValid = await UserModel.verifyPassword(existing.id, password);
    if (!isValid) throw new AuthenticationError('Invalid credentials');

    const { password: _, ...safeUser } = existing as any;
    const token = jwt.sign({ id: existing.id, email: existing.email, role: existing.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new AuthenticationError('Unauthorized');
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, jwtConfig.secret) as any;
    const user = await UserModel.findById(payload.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;


