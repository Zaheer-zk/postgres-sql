"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const app_1 = require("./app");
// require('dotenv').config({path: './env'})
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: '../.env',
});
let client;
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
const queryAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (client) {
            const { rows } = yield client.query('SELECT * FROM users');
            console.log('Querying all data fro users table:', rows);
            res.json(rows);
        }
        else {
            console.error('Client is undefined');
        }
    }
    catch (err) {
        console.error('Error during the insertion:', err);
    }
    // finally {
    //   if (client) {
    //     await client.end();
    //   }
    // }
});
app_1.app.get('/', queryAllUsers);
app_1.app.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield client.query(query, [username]); // after
        res.json(rows);
    }
    catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbClient = yield (0, db_1.default)();
        client = dbClient;
        app_1.app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    }
    catch (err) {
        console.log('PG neon DB connection failed !!! ', err);
    }
}))();
