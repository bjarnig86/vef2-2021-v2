import express from 'express';
import xss from 'xss';
import { body, validationResult } from 'express-validator';
import { insert, select } from './db.js';

// TODO skráningarvirkni
// lesa gögn frá formi, sani vali

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// function isError(req, res, next) {
//   const { body: { name = '', ssn = '', comment = '' } = {} } = req;
//   // console.log('req :>> ', req);
//   const data = [name, ssn, comment];

//   const validation = validationResult(req);
//   if (!validation.isEmpty()) {
//     const errors = validation.array().map((i) => i.msg);
//     data.error = errors;
//     data.title = 'Villa';

//     // console.log('errorMessages :>> ', errorMessages);
//     // res.send(`<p>Villur:</p>
//     // <ul>
//     //   <li>${errorMessages.join('</li><li>')}</li>
//     // </ul>`);
//     // console.log('villa :>> ', villa);
//     console.log('errors :>> ', errors);
//     return res.render('index', data);
//   }
//   return next();
//   // gögn OK
// }

export function sanitizeXss(fieldName) {
  return (req, res, next) => {
    if (!req.body) {
      next();
    }

    const field = req.body[fieldName];

    if (field) {
      req.body[fieldName] = xss(field);
    }

    next();
  };
}

const router = express.Router();

// validation og sanitation - kannski bæta við xss.sanitation
const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

// router.post(
// '/',

// validation
const validation = [
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
];

// (req, res, next) => {
//   // console.log('req.body :>> ', req.body);
//   // res.send(`Post gögn: ${JSON.stringify(req.body)}`);

//   isError(req, res, next);
//   // next();
// },
// // sanitize

const sanitazions = [
  body('name').trim().escape(),
  sanitizeXss('name'),

  sanitizeXss('ssn'),
  body('ssn').blacklist('-'),

  sanitizeXss('comment'),
  body('comment').trim().escape(),
];
// (req, res) => {
//   return res.send(`
//   <p>Skráning móttekin!</p>
//   <dl>
//     <dt>Nafn</dt>
//     <dd>${req.body.name}</dd>
//     <dt>Kennitala</dt>
//     <dd>${req.body.ssn}</dd>
//     <dt>Athugasemd</dt>
//     <dd>${req.body.comment}</dd>
//   </dl>
// `);
// }

// Route handler fyrir form umsóknar.
async function form(req, res) {
  const list = await select();

  const data = {
    title: 'Undiskrifalisti',
    name: '',
    ssn: '',
    comment: '',
    errors: [],
    list,
  };
  res.render('index', data);
}

async function showErrors(req, res, next) {
  const list = await select();

  const { body: { name = '', ssn = '', comment = '' } = {} } = req;

  const data = {
    name,
    ssn,
    comment,
    list,
  };

  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    const errors = validations.array();
    data.errors = errors;
    data.title = 'Villur';

    return res.render('index', data);
  }

  return next();
}

async function formPost(req, res) {
  const { body: { name = '', ssn = '', comment = '' } = {} } = req;

  const data = {
    name,
    ssn,
    comment,
  };

  const okay = await insert(data);
  if (okay) {
    res.render('error', { title: 'Skráning tókst ekki!' });
  }

  res.redirect('/');
}

// function thanks(req, res) {
//   return res.render('index', { title: 'Skráning móttekin' });
// }

router.get('/', form);
// router.get('/index', thanks);

router.post(
  '/',
  validation,

  showErrors,

  sanitazions,

  // eslint-disable-next-line comma-dangle
  catchErrors(formPost)
);

export { router };
