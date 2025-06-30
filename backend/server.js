import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './models/index.js';
import pointageRouter from './routers/pointage.router.js';
import authRouter from './routers/auth.router.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(cookieParser());

app.use('/pointages', pointageRouter);
app.use('/', authRouter);

const start = async () => {
  await sequelize.sync({ alter: true });
  app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
};

start(); 