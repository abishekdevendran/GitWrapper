import express, {Express} from 'express';
import dotenv from 'dotenv';
import repos from './lib/controllers/repos';

dotenv.config();

const app: Express = express();
const PORT= process.env.PORT || 3000;

app.use('/repos', repos);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create an API endpoint that can list all Repos of a User
app.get('/repos/:username', (req, res) => {});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

