import createHttpError from 'http-errors';
import { findSessionByAccessToken, findUserById } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await findSessionByAccessToken(token);

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUserById(session.userId);

  if (!user) {
    return next(
      createHttpError(401, 'User not found associated with the session'),
    );
  }

  req.user = user;
  next();
};

export const authenticateMiddleware = authenticate;
