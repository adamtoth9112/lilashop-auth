import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lilashop_auth';

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('🔥 MongoDB Connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB Connection Error:', err));
