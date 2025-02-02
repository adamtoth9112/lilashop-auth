import express from 'express';
import signupRouter from './signup';
import loginRouter from './login';

const router = express.Router();

router.use('/signup', signupRouter);
router.use('/login', loginRouter);

export default router;
