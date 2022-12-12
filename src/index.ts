import express, { Express } from 'express';
import dotenv from 'dotenv';
import repos from './lib/controllers/repos';
import login from './lib/controllers/login';
import user from './lib/controllers/user';
import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import session from './lib/helpers/sessionStore';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
  }
}

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use('/repos', repos);
app.use('/login', login);
app.use('/user', user);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
