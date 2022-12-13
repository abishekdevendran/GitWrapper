import express, { Express } from 'express';
import dotenv from 'dotenv';
import getUser from '../helpers/fetchers/getUser';
import getAccessToken from '../helpers/fetchers/getAccessToken';
import secretFans from '../helpers/fetchers/secretFans';
import popularRepos from '../helpers/fetchers/popularRepos';
import getActiveRepos from '../helpers/fetchers/getActiveRepos';
const router = express.Router();

dotenv.config();

router.get('/signin/callback', async (req, res) => {
  if (req.query.code) {
    const code = req.query.code as string;
    try{
      const accessToken = await getAccessToken(code);
      req.session.accessToken = accessToken.access_token;
      const user = await getUser(accessToken.access_token);
      req.session.user = user;
      res.send('Auth Successful');
    }
    catch(err){
      console.log('Error getting access token: ', err);
      res.send('Error getting access token');
    }
  } else {
    res.send('Auth Failed');
  }
});

router.get('/logout', (req, res) => {
  if (!req.session.accessToken) {
    res.send('No session found');
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session: ', err);
      res.send('Error destroying session');
    }
    res.clearCookie('gitWrapper');
    res.send('Session destroyed');
  });
});

router.get('/login', (req, res) => {
  if (req.session.accessToken) {
    res.send('Already logged in');
    return;
  }
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user%20repo%20gist`
  );
});

router.get('/secretfans', async (req, res) => {
  if (!req.body.username && !req.session.accessToken){
    res.send('No username or access token found');
    return;
  }
  const username= req.body.username || req.session.user!.login;
  const accessToken = req.session.accessToken!;
  console.log(username);
  try {
    const list = await secretFans(accessToken, username);
    res.send(list);
  } catch (err) {
    console.log(err);
    if(err instanceof Error){
      res.status(500).send(err.message);
    }
    else{
      res.status(500).send('Error getting secret fans');
    }
  }
});

router.get('/specificsecretfans', async (req, res) => {
  if (!req.body.username && !req.session.accessToken) {
    res.send('No username or access token found');
    return;
  }
  const username = req.body.username || req.session.user!.login;
  const accessToken = req.session.accessToken!;
  console.log(username);
  try {
    const list = await secretFans(accessToken, username, true);
    res.send(list);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send('Error getting secret fans');
    }
  }
});

router.get('/popularRepos', async (req, res) => {
  if (!req.body.username && !req.session.accessToken) {
    res.send('No username or access token found');
    return;
  }
  const username = req.body.username || req.session.user!.login;
  const accessToken = req.session.accessToken!;
  console.log(username);
  try {
    const list = await popularRepos(accessToken, username);
    res.send(list);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send('Error getting secret fans');
    }
  }
});

router.get('/activeRepos', async (req, res) => {
  if (!req.body.username && !req.session.accessToken) {
    res.send('No username or access token found');
    return;
  }
  const username = req.body.username || req.session.user!.login;
  const accessToken = req.session.accessToken!;
  console.log(username);
  try {
    const list = await getActiveRepos(accessToken, username);
    res.send(list);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send('Error getting secret fans');
    }
  }
});

export default router;
