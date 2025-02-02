import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // ✅ Validate Input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // ✅ Create a new user
        const newUser = new User({ email, password });
        await newUser.save();

        // ✅ Respond with success (no password in response for security reasons)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
