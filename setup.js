/* eslint-disable no-useless-catch */
import dotenv from 'dotenv';
import fs from 'fs';
import util from 'util';
import pg from 'pg';

// keyra schema.sql og fylla inní töflu með fake.sql

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const readFileAsync = util.promisify(fs.readFile);
const pool = new pg.Pool({ connectionString });

export async function query(q) {
  const client = await pool.connect();

  // await client.connect();

  try {
    const result = await client.query(q);

    const { rows } = result;
    return rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

export default async function main() {
  console.log(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS signatures');
  console.info('Töflu eytt');

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./schema.sql');
    await query(createTable.toString('utf-8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  // bæta við færslum í töflu

  try {
    const insert = await readFileAsync('./sql/fake.sql');
    await query(insert.toString('utf-8'));
    console.info('Undirskrift bætt við töflu');
  } catch (e) {
    console.error('Villa við að bæta við gögnum', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
