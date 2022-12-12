import express, { Express } from 'express';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "clientID";
router.get('/', (req, res) => {
  if(!GITHUB_CLIENT_ID){
    res.send('GITHUB_CLIENT_ID is not set');
    return;
  }
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
  );
});

export default router;
