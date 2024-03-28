const { Pool } = require('pg');

require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,

  database: PGDATABASE,

  username: PGUSER,

  password: PGPASSWORD,

  port: 5432,

  ssl: {
    require: true,
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connect to database');
    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export default connectDB;
