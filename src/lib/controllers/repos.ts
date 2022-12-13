import express, { Express, Request, Response } from 'express';
import getUserRepos from '../helpers/fetchers/getUserRepos';
import createRepo from '../helpers/fetchers/createRepo';
const router = express.Router({ strict: true });

router.put('/create', (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      res.status(400).send('Repo name is required');
      return;
    }
    console.log('req.session.accessToken: ', req.session.accessToken);
    createRepo(
      req.session.accessToken!,
      req.body.name,
      req.body.visibility,
      req.body.description
    )
      .then((data) => {
        res.send('Repo created successfully');
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err.message);
      });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
router.get('/:username', (req, res) => {
  try {
    getUserRepos(req.params.username, req.session.accessToken)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err.message);
      });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
router.get('/', (req, res) => {
  try {
    const username = req.body?.username
      ? req.body.username
      : req.session.user?.login;
    getUserRepos(username, req.session.accessToken)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err.message);
      });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

export default router;
