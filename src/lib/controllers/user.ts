import express, { Express } from 'express';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();

const getAccessToken = async (code: string) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  };
  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body)
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('try/catch error: ', err);
    throw err;
  }
};

router.get('/signin/callback', (req, res) => {
  if (req.query.code) {
    const code = req.query.code as string;
    getAccessToken(code)
      .then((data) => {
        //set the session
        req.session.accessToken = data.access_token;
        res.send({ Message: 'Auth Successful' });
      })
      .catch((err) => {
        console.log('getAccessToken error: ', err);
        res.send('Auth Failed');
      });
  } else {
    res.send('Auth Failed');
  }
});

router.get('/signout', (req, res) => {
  if(!req.session.accessToken){
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

export default router;
