import express from 'express';
import UserUseCases from '../use-cases/user.use-cases';

const router = express.Router();

router.post('/user/login', UserUseCases.authenticate);
router.post('/user/refresh', UserUseCases.refresh);
router.post('/user/register', UserUseCases.register);
router.post('/user/logout', UserUseCases.logout);

export default router;
