import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

const redisClient =
  process.env.NODE_ENV === 'production'
    ? createClient({
        legacyMode: true,
        url: process.env.REDIS_URL
      })
    : createClient({
        legacyMode: true,
        url: 'redis://default:gAfMJJV7r290BrexhAjj@containers-us-west-115.railway.app:7844'
      });

redisClient
  .connect()
  .then(() => console.log('Redis Connected Successfully.'))
  .catch((err) => console.log('Redis Connection Failed: ', err));

const RedisStore = connectRedis(session);
const secretKey = process.env.SESSION_SECRET || 'secret';

export default session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: secretKey,
  resave: false,
  proxy: true,
  name: 'gitWrapper',
  cookie: {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 30, //30 mins
    httpOnly: true
  }
});
