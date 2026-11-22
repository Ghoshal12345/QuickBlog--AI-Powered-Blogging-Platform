import express from 'express';
import upload from '../middlewares/multer.js';
import { signIn, googleSignIn, signOut, signup, verifySignupOTP, completeSignup, forgotPassword, verifyForgotPasswordOTP, resetPassword, deleteUser, getCurrentUser, editProfile, requestEmailChange, verifyEmailChange,} from '../controllers/user.js';
import { cookieAuthentication } from '../middlewares/authentication.js';
import { authLimiter, otpLimiter } from '../middlewares/rate_limiter.js';
import validate from '../middlewares/validate.js';
import { forgotPasswordSchema, verifyForgotPasswordOTPSchema, resetPasswordSchema, signupSchema, verifySignupOTPSchema, completeSignupSchema, signInSchema, googleSignInSchema, editProfileSchema, requestEmailChangeSchema, verifyEmailChangeSchema } from '../validators/user.validator.js';

const userRouter = express.Router();

//public routes(signup and OTP verification)
userRouter.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), forgotPassword);
userRouter.post('/verify-reset-password-otp', validate(verifyForgotPasswordOTPSchema), verifyForgotPasswordOTP );
userRouter.post('/reset-password',validate(resetPasswordSchema), resetPassword );

userRouter.post('/signup', authLimiter, otpLimiter, validate(signupSchema), signup );
userRouter.post('/verify-signup-otp', validate(verifySignupOTPSchema), verifySignupOTP);
userRouter.post('/complete-signup', validate(completeSignupSchema), completeSignup);

userRouter.post('/signIn', authLimiter, validate(signInSchema), signIn);
userRouter.post('/google-signin', validate(googleSignInSchema), googleSignIn);

//protected routes
userRouter.post('/signOut', cookieAuthentication, signOut);
userRouter.delete('/delete', cookieAuthentication, deleteUser);

userRouter.get('/me', cookieAuthentication, getCurrentUser);
userRouter.patch('/profile', cookieAuthentication, upload.single('profileImage'), validate(editProfileSchema), editProfile);
userRouter.post('/request-email-change', cookieAuthentication, otpLimiter, validate(requestEmailChangeSchema), requestEmailChange);
userRouter.post('/verify-email-change', cookieAuthentication, validate(verifyEmailChangeSchema), verifyEmailChange);

export default userRouter;