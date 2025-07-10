import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize, Employe, Pointage } from './models/index.js';
import pointageRouter from './routers/pointage.router.js';
import authRouter from './routers/auth.router.js';
import documentRouter from './routers/document.router.js';
import rapportRouter from './routers/rapport.router.js';
import activiteRouter from './routers/activite.router.js';
import zktecoRouter from './routers/zkteco.router.js';
import usersRouter from './routers/users.router.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(cookieParser());

// Modular routers
app.use('/pointages', pointageRouter);
app.use('/', authRouter);
app.use('/uploads', express.static('uploads'));
app.use('/documents', documentRouter);
app.use('/rapports', rapportRouter);
app.use('/activites', activiteRouter);
app.use('/api/zkteco', zktecoRouter);
app.use('/api/users', usersRouter);


const start = async () => {
  // await sequelize.sync({ force: true }); 
  app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
};

start();