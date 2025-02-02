import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

const router = express.Router();

const secretKey: string = process.env.JWT_SECRET || 'defaultSecretKey';

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and return a JWT
 * @access  Public
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // ✅ Validate Input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // ✅ Compare Passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Login successful' });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;