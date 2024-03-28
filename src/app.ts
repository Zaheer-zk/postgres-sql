import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();

const route = express.Router();

//* mainly used middleware
app.use(express.static('public'));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  express.json({
    limit: '16kb',
  })
);
app.use(express.urlencoded({ extended: true }));

//* routers import

//* routes declaration
// route.get('/', queryAllUsers);

export { app };
