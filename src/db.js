import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

// TODO gagnagrunnstengingar
async function bla() {
  const pgClient = new pg.Client(connectionString);
  await pgClient.connect();

  // var query = pgClient.query('SELECT * FROM vef2-2021-v2');
  // console.log(query);
}

bla();
