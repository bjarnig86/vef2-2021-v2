import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

app.use(express.urlencoded({ extended: true }));

const { PORT: port = 3000 } = process.env;

const app = express();

// TODO setja upp rest af virkni!
app.get('/', (req, res) => {
  res.send(`
<form method="post" action="/post" enctype="application/x-www-form-urlencoded">
  <input type="text" name="data">
  <input type="file" name="file">
  <button>Senda</button>
</form>
  `);
});

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
