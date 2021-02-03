import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

app.use(express.urlencoded({ extended: true }));

const { PORT: port = 3000 } = process.env;

const app = express();

// TODO setja upp rest af virkni!
app.get('/', (req, res) => {
  res.send(`Hello world
  `);
});

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
