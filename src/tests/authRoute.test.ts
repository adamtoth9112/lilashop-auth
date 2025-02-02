import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

// 🛠 Setup In-Memory MongoDB Before Tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB URI:', mongoUri);

    await mongoose.connect(mongoUri);
});

// 🛠 Cleanup After Each Test
afterEach(async () => {
    await User.deleteMany();
});

// 🛠 Close MongoDB Connection After All Tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('POST /auth/signup', () => {
    it('✅ Should create a new user and return 201', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'securepassword'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');

        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
    });

    it('❌ Should return 400 if email is missing', async () => {
        const res = await request(app).post('/auth/signup').send({
            password: 'securepassword'
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email and password are required');
    });

    it('❌ Should return 400 if password is too short', async () => {
        const res = await request(app).post('/auth/signup').send({
            email: 'test@example.com',
            password: '123'
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Password must be at least 6 characters long');
    });

    it('❌ Should return 400 if user already exists', async () => {
        await new User({ email: 'duplicate@example.com', password: 'securepassword' }).save();

        const res = await request(app).post('/auth/signup').send({
            email: 'duplicate@example.com',
            password: 'securepassword'
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });
});
