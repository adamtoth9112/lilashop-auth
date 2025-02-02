import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

// Basic Route
app.get('/', (_req, res) => {
    res.send('LilaShop Auth Service Running!');
});


export default app;
