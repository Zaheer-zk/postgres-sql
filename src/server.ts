import connectDB from './db';
import { app } from './app';

// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import { query } from 'express';
dotenv.config({
  path: '../.env',
});

let client: any;

// connectDB()
//   .then((dbClient) => {
//     client = dbClient; // Assign the client
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     });

//     queryAllUsers();
//   })
//   .catch((err) => {
//     console.log('PG neon DB connection failed !!! ', err);
//   });

const queryAllUsers = async (req: any, res: any) => {
  try {
    if (client) {
      const { rows } = await client.query('SELECT * FROM users');
      console.log('Querying all data fro users table:', rows);
      res.json(rows);
    } else {
      console.error('Client is undefined');
    }
  } catch (err) {
    console.error('Error during the insertion:', err);
  }
  // finally {
  //   if (client) {
  //     await client.end();
  //   }
  // }
};

app.get('/', queryAllUsers);

app.get('/user', async (req, res) => {
  const username = req.query.username;

  // Construct SQL query (Vulnerable to SQL injection)
  // http://localhost:8000/user?username='OR 1=1 --
  // const query = `SELECT * FROM users WHERE username = '${username}'`;

  // to avoid SQL injection
  // Construct SQL query with parameterized query
  const query = 'SELECT * FROM users WHERE username = $1';

  try {
    // Execute SQL query
    // const { rows } = await client.query(query); // before

    // Execute SQL query with parameterized query
    const { rows } = await client.query(query, [username]); // after

    res.json(rows);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

(async () => {
  try {
    const dbClient = await connectDB();
    client = dbClient;
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  } catch (err) {
    console.log('PG neon DB connection failed !!! ', err);
  }
})();
