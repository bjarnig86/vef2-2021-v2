import express from 'express';
import dotenv from 'dotenv';
import main from '../setup.js';
import { router } from './registration.js';
import { formatDate } from './db.js';

dotenv.config();

const { PORT: port = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));

// set template machine
app.set('views', './views');
app.set('view engine', 'ejs');

app.locals.formatDate = formatDate;

// static files
app.use(express.static('./public'));

// TODO setja upp rest af virkni!
// app.get('/', (req, res) => {
//   const tafla = main();
//   tafla.then((response) => {
//     res.render('./index', {
//       title: 'Undirskrifarlisti',
//       dalkar: response,
//       router,
//     });
//   });
// });

app.use('/', router);
// app.use('/mottekid', router);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
