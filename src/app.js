import express from 'express';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

dotenv.config();

const { PORT: port = 3000 } = process.env;

const app = express();

// set template machine
app.set('view engine', 'ejs');

// static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

function isError(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((i) => i.msg);
    return res.send(`<p>Villur:</p>
    <ul>
      <li>${errorMessages.join('</li><li>')}</li>
    </ul>`);
  }
  // gögn OK
}

// TODO setja upp rest af virkni!
app.get('/', (req, res, next) => {
  res.render('./index');
  next();
});

const nationalIdPattern = '[0-9]{6}-?[0-9]{4}$';
app.post(
  '/post',

  // validation
  body('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('Nafn má að hámarki vera 128 stafir'),
  body('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tómt'),
  body('ssn')
    .matches(new RegExp(nationalIdPattern))
    .withMessage('Kennitala verður að vera á formi 000000-0000 eða 0000000000'),
  body('comment')
    .isLength({ max: 400 })
    .withMessage('Athugasemd má að hámarki vera 400 stafir'),

  (req, res, next) => {
    // console.log('req.body :>> ', req.body);
    // res.send(`Post gögn: ${JSON.stringify(req.body)}`);

    isError(req, res);
    next();
  },

  // sanitize

  body('name').trim().escape(),
  body('ssn').blacklist('-'),
  body('comment').trim().escape(),

  (req, res) => {
    return res.send(`
      <p>Skráning móttekin!</p>
      <dl>
        <dt>Nafn</dt>
        <dd>${req.body.name}</dd>
        <dt>Kennitala</dt>
        <dd>${req.body.ssn}</dd>
        <dt>Athugasemd</dt>
        <dd>${req.body.comment}</dd>
      </dl>
    `);
  }
);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
