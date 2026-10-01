import express from 'express';
import upload from '../middlewares/multer.js';
import { signIn, googleSignIn, signOut, signup, verifySignupOTP, completeSignup, forgotPassword, verifyForgotPasswordOTP, resetPassword, deleteUser, getCurrentUser, editProfile, requestEmailChange, verifyEmailChange,} from '../controllers/user.js';
import { cookieAuthentication } from '../middlewares/authentication.js';

const userRouter = express.Router();

//public routes(signup and OTP verification)
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-reset-password-otp', verifyForgotPasswordOTP );
userRouter.post('/reset-password',resetPassword );

userRouter.post('/signup', signup );
userRouter.post('/verify-signup-otp', verifySignupOTP);
userRouter.post('/complete-signup', completeSignup);

userRouter.post('/signIn', signIn);
userRouter.post('/google-signin', googleSignIn);

//protected routes
userRouter.post('/signOut', cookieAuthentication, signOut);
userRouter.delete('/delete', cookieAuthentication, deleteUser);

userRouter.get('/me', cookieAuthentication, getCurrentUser);
userRouter.patch('/profile', cookieAuthentication, upload.single('profileImage'), editProfile);
userRouter.post('/request-email-change', cookieAuthentication, requestEmailChange);
userRouter.post('/verify-email-change', cookieAuthentication, verifyEmailChange);

export default userRouter;