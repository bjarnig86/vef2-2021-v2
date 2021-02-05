import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { PORT: port = 3000 } = process.env;

const app = express();

// set template machine
app.set('view engine', 'ejs');

// static files
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('./index');
});

// TODO setja upp rest af virkni!

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
