import express from 'express';
import cors from 'cors';
import { sequelize, Employe, Pointage } from './models/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/poigesnta', async (req, res) => {
  const data = await Pointage.findAll({
    include: Employe,
    order: [['date', 'DESC']],
  });
  res.json(data);
});

app.post('/pointages', async (req, res) => {
  const { nom, rapport } = req.body;

  if (!nom || !rapport) return res.status(400).json({ message: 'Nom et rapport obligatoires' });

  let employe = await Employe.findOne({ where: { nom } });
  if (!employe) employe = await Employe.create({ nom });

  const pointage = await Pointage.create({
    rapport,
    employeId: employe.id,
  });

  res.status(201).json(pointage);
});

const start = async () => {
  // await sequelize.sync({ force: true });
  app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
};

start();
