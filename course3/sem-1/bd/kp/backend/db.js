import pgPromise from 'pg-promise';

const pgp = pgPromise();
export const db = pgp({
  user: 'postgres_user',
  password: 'postgres_password',
  host: 'localhost',
  port: 5430,
  database: 'postgres_db',
})
