import express, { Express, Request, Response } from 'express';
import auth from '../middlewares/auth';
import getRepoDetails from '../helpers/fetchers/getRepoDetails';
import repoTopicsHandler from '../helpers/fetchers/repoTopicsHandler';
const router = express.Router();

router.use(auth);

router.get('/stargazers', async (req: Request, res: Response) => {
  if (req.body.name) {
    try {
      const userName = req.body?.username
        ? req.body.username
        : req.session.user?.login;
      const repoDetails = await getRepoDetails(
        req.session.accessToken!,
        userName,
        req.body.name,
        'stargazers'
      );
      if (repoDetails.message === 'Not Found') {
        res.status(404).send('Repo not found');
      }
      // return just logins
      const stargazers = repoDetails.map((user: any) => user.login);
      res.send(stargazers);
    } catch (err) {
      console.log('Outer: ', err);
      if (err instanceof Error) {
        res.status(404).send(err.message);
      } else {
        res.status(400).send('Something went wrong');
      }
    }
  } else {
    res.status(400).send('Repo name is required');
  }
});

router.get('/contributors', async (req: Request, res: Response) => {
  if (req.body.name) {
    try {
      const userName = req.body?.username
        ? req.body.username
        : req.session.user?.login;
      const repoDetails = await getRepoDetails(
        req.session.accessToken!,
        userName,
        req.body.name,
        'contributors'
      );
      if (repoDetails.message === 'Not Found') {
        res.status(404).send('Repo not found');
      }
      // return just logins
      const contributors = repoDetails.map((user: any) => user.login);
      res.send(contributors);
    } catch (err) {
      console.log('Outer: ', err);
      if (err instanceof Error) {
        res.status(404).send(err.message);
      } else {
        res.status(400).send('Something went wrong');
      }
    }
  } else {
    res.status(400).send('Repo name is required');
  }
});

router.all('/topics', async (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(400).send('Repo name is required');
    return;
  }
  if (!req.session.accessToken) {
    res.status(401).send('You are not logged in');
    return;
  }
  if (req.body.name === req.session.user?.login) {
    if (req.method !== 'GET') {
      res.status(400).send('You can only make changes to your own repos.');
      return;
    }
  }
  try {
    const userName = req.body?.username
      ? req.body.username
      : req.session.user?.login;
      const accessToken = req.session.accessToken!;
    const repoDetails = await repoTopicsHandler(accessToken, userName, req.body.name, req.method as any, req.body.topic);
    console.log('repoDetails: ', repoDetails);
    // return just first few keys
    res.send(repoDetails)
  } catch (err) {
    console.log('Outer: ', err);
    if (err instanceof Error) {
      res.status(404).send(err.message);
    } else {
      res.status(400).send('Something went wrong');
    }
  }
});

router.get('/', async (req: Request, res: Response) => {
  if (req.body.name) {
    try {
      const userName = req.body?.username
        ? req.body.username
        : req.session.user?.login;
      const repoDetails = await getRepoDetails(
        req.session.accessToken!,
        userName,
        req.body.name
      );
      console.log('repoDetails: ', repoDetails);
      // return just first few keys
      const { name, description, html_url, stargazers_count, owner } =
        repoDetails;
      res.send({
        name,
        description,
        html_url,
        stargazers_count,
        owner: owner.login
      });
    } catch (err) {
      console.log('Outer: ', err);
      if (err instanceof Error) {
        res.status(404).send(err.message);
      } else {
        res.status(400).send('Something went wrong');
      }
    }
  } else {
    res.status(400).send('Repo name is required');
  }
});

export default router;
