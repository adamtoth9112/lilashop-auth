import express from 'express';
import router from './routes/auth/index';

const app = express();
app.use(express.json());

app.use('/auth', router);

// Basic Route
app.get('/', (_req, res) => {
    res.send('LilaShop Auth Service Running!');
});


export default app;
