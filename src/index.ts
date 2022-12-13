import express, { Express } from 'express';
import dotenv from 'dotenv';
import repos from './lib/controllers/repos';
import repo from './lib/controllers/repo';
import user from './lib/controllers/user';
import session from './lib/helpers/sessionStore';
import User from './lib/helpers/types/User';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    user: User;
  }
}

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use('/user', user);
app.use('/repos', repos);
app.use('/repo', repo);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
