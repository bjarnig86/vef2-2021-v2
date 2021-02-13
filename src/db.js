import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL: connectionString } = process.env;

const pool = new pg.Pool({ connectionString });

export function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (day > 9 && month > 9) {
    return `${day}.${month}.${year}`;
  }
  if (day > 9) {
    return `${day}.0${month}.${year}`;
  }
  if (month > 9) {
    const d = `0${day}.${month}.${year}`;
    return d;
  }

  return `0${day}.0${month}.${year}`;
}

/**
 *
 * @param {string} q Query til að keyra
 * @param {array} values Fylki af gildum fyrir query
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
export async function query(q, values = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(q, values);

    return result;
    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

export async function insert(data) {
  const q = `
  INSERT INTO signatures
  (name, ssn, comment)
  VALUES
  ($1, $2, $3)`;
  const values = [data.name, data.ssn, data.comment];

  return query(q, values);
}

export async function select() {
  const result = await query('SELECT * FROM signatures ORDER BY signed');

  return result.rows;
}
