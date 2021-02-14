import express from 'express';
import dotenv from 'dotenv';
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

app.use('/', router);
// app.use('/mottekid', router);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port);
