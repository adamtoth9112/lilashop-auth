import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app'; // Import app without MongoDB connection
import User from '../models/User';
import bcrypt from 'bcryptjs';

let mongoServer: MongoMemoryServer;

// 🛠 Setup In-Memory MongoDB Before Tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
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

describe('POST /auth/login', () => {
    it('✅ Should log in a user and return a JWT', async () => {
        await new User({ email: 'testuser@example.com', password: 'securepassword' }).save();

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'testuser@example.com', password: 'securepassword' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('❌ Should return 401 for incorrect password', async () => {
        const password = await bcrypt.hash('securepassword', 10);
        await new User({ email: 'testuser@example.com', password }).save();

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'testuser@example.com', password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('❌ Should return 401 for non-existent user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'notfound@example.com', password: 'password' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('❌ Should return 400 if email is missing', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ password: 'securepassword' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email and password are required');
    });

    it('❌ Should return 400 if password is missing', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'testuser@example.com' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email and password are required');
    });
});
