import express, {Express} from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World from repos!');
});

router.get('/:id', async (req, res) => {
    // Make a call to github api to get the repo details
    const response=await fetch(`https://api.github.com/repos/${req.params.id}`);
    const data=await response.json();
    res.send(data);
});

export default router;