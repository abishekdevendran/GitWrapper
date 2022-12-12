import express, {Express} from 'express';

const app: Express = express();
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World from repos!');
});

export default router;