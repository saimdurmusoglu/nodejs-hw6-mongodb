// src/controllers/auth.js
import { registerUser, loginUser, refreshSession, logoutUser, requestResetToken, resetPassword } from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const setupSessionCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: 'None',
  });
};

const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const loginController = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);

  setupSessionCookie(res, refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies; 
  
  const session = await refreshSession(refreshToken);

  setupSessionCookie(res, session.refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const logoutController = async (req, res) => {
  if (req.cookies.refreshToken) {
    await logoutUser(req.cookies.refreshToken);
  }

  res.clearCookie('refreshToken');
  
  res.status(204).send();
};

const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  
  await requestResetToken(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const register = ctrlWrapper(registerController);
export const login = ctrlWrapper(loginController);
export const refresh = ctrlWrapper(refreshController);
export const logout = ctrlWrapper(logoutController);
export const sendResetEmail = ctrlWrapper(sendResetEmailController);
export const resetPwd = ctrlWrapper(resetPasswordController);