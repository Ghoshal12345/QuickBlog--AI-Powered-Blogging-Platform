import User from '../models/user.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import OTP from '../models/otp.js';

import { toFile } from '@imagekit/nodejs';
import imageKitClient from '../configs/imagekit.js';

import { generateToken } from '../services/auth.js';
import { createAndSendOTP, verifyOTP } from '../services/otp.js';
import { verifyGoogleToken } from '../services/googleAuth.js';

// Forgot password
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await createAndSendOTP({
            email: normalizedEmail,
            name: user.name,
            purpose: 'reset-password'
        });

        return res.status(200).json({
            message: 'If an account exists with this email, an OTP has been sent'
        });
    } catch (error) {
        console.error('Error during forgot password:', error);
        return res.status(500).json({
            message: 'Failed to process forgot password request'
        });
    }
}

// Verify forgot-password OTP
async function verifyForgotPasswordOTP(req, res) {
    try {
        const { email, otp } = req.body;

        if (typeof email !== 'string' || !email.trim() || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isOTPValid = await verifyOTP({
            email: normalizedEmail,
            otp,
            purpose: 'reset-password'
        });

        if (!isOTPValid?.success) {
            return res.status(400).json({
                message: isOTPValid?.message || 'Invalid or expired OTP'
            });
        }

        return res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Error verifying forgot password OTP:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Reset password
async function resetPassword(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: 'reset-password',
            verified: true
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'Please verify your OTP first'
            });
        }

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.password = password;
        await user.save(); // The User model should hash the password in its pre-save hook.

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Signup
async function signup(req, res) {
    try {
        let { name, email } = req.body;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            typeof email !== 'string' ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: 'Name and email are required'
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        await createAndSendOTP({
            email,
            name,
            purpose: 'signup'
        });

        return res.status(200).json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({
            message: 'Failed to send verification OTP'
        });
    }
}

// Verify signup OTP
async function verifySignupOTP(req, res) {
    try {
        const { email, otp } = req.body;

        if (typeof email !== 'string' || !email.trim() || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isOTPValid = await verifyOTP({
            email: normalizedEmail,
            otp,
            purpose: 'signup'
        });

        if (!isOTPValid?.success) {
            return res.status(400).json({
                message: isOTPValid?.message || 'Invalid or expired OTP'
            });
        }

        return res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Error verifying signup OTP:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Complete signup
async function completeSignup(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: 'signup',
            verified: true
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'Please verify your email first'
            });
        }

        await User.create({
            name: otpRecord.name,
            email: normalizedEmail,
            password
        });

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(201).json({
            message: 'Account created successfully'
        });
    } catch (error) {
        console.error('Error completing signup:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Sign in
async function signIn(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const checkUser = await User.findOne({
            email: normalizedEmail
        });

        if (!checkUser) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = await User.matchPassword(normalizedEmail, password);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        user.sessionVersion = (user.sessionVersion || 0) + 1;
        await user.save();

        const token = generateToken(
            user._id,
            user.role,
            user.sessionVersion
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error during sign-in:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Google sign in
async function googleSignIn(req, res) {
    try {
        const { googleId_token } = req.body;

        if (!googleId_token) {
            return res.status(400).json({
                message: 'Google ID token is required'
            });
        }

        const googleUser = await verifyGoogleToken(googleId_token);

        if (!googleUser) {
            return res.status(401).json({
                message: 'Invalid Google ID token'
            });
        }

        const {
            googleId,
            email,
            name,
            profileImage,
            emailVerified
        } = googleUser;

        if (!emailVerified) {
            return res.status(401).json({
                message: 'Google email is not verified'
            });
        }

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                // Require explicit account linking for existing accounts
                // if your application supports linking different providers.
                return res.status(409).json({
                    message: 'An account with this email already exists. Please use your original sign-in method.'
                });
            }

            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                profileImage
            });
        }

        user.sessionVersion = (user.sessionVersion || 0) + 1;
        await user.save();

        const token = generateToken(
            user._id,
            user.role,
            user.sessionVersion
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Google login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Sign out
async function signOut(req, res) {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error during sign-out:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Get current user
async function getCurrentUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authenticated'
            });
        }

        return res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            profileImage: req.user.profileImage
        });
    } catch (error) {
        console.error('Error getting current user:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Edit profile
async function editProfile(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Name is required'
            });
        }

        name = name.trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        user.name = name;

        if (req.file) {
            const oldProfileImageFileId = user.profileImageFileId;

            const imageFileForImageKit = await toFile(
                req.file.buffer,
                req.file.originalname
            );

            const response = await imageKitClient.files.upload({
                file: imageFileForImageKit,
                fileName: req.file.originalname
            });

            user.profileImage =
                `${response.url}?tr=w-500,q-auto,f-webp`;
            user.profileImageFileId = response.fileId;

            if (oldProfileImageFileId) {
                try {
                    await imageKitClient.files.delete(
                        oldProfileImageFileId
                    );
                } catch (imgError) {
                    console.error(
                        'ImageKit deletion failed:',
                        imgError.message || imgError
                    );
                }
            }
        }

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Request email change
async function requestEmailChange(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({
                message: 'Google sign-in users cannot change their email'
            });
        }

        let { newEmail } = req.body;

        if (typeof newEmail !== 'string' || !newEmail.trim()) {
            return res.status(400).json({
                message: 'New email is required'
            });
        }

        newEmail = newEmail.trim().toLowerCase();

        if (newEmail === user.email) {
            return res.status(400).json({
                message: 'This is already your current email'
            });
        }

        const existingUser = await User.findOne({
            email: newEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'This email is already in use by another user'
            });
        }

        await createAndSendOTP({
            email: newEmail,
            name: user.name,
            purpose: 'email-change'
        });

        return res.status(200).json({
            message: 'OTP sent to the new email for verification'
        });
    } catch (error) {
        console.error('Error during email change request:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Verify email change
async function verifyEmailChange(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({
                message: 'Google sign-in users cannot change their email'
            });
        }

        let { newEmail, otp } = req.body;

        if (
            typeof newEmail !== 'string' ||
            !newEmail.trim() ||
            !otp
        ) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        newEmail = newEmail.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: newEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'This email is already in use by another user'
            });
        }

        const isOTPValid = await verifyOTP({
            email: newEmail,
            otp,
            purpose: 'email-change'
        });

        if (!isOTPValid?.success) {
            return res.status(400).json({
                message: isOTPValid?.message || 'Invalid or expired OTP'
            });
        }

        user.email = newEmail;
        await user.save();

        await OTP.deleteMany({
            email: newEmail,
            purpose: 'email-change'
        });

        return res.status(200).json({
            message: 'Email changed successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error during email change verification:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// Delete user account
async function deleteUser(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Delete the user's profile image from ImageKit
        if (user.profileImageFileId) {
            try {
                await imageKitClient.files.delete(
                    user.profileImageFileId
                );
            } catch (imgError) {
                console.error(
                    'Profile image deletion failed:',
                    imgError.message || imgError
                );
            }
        }

        // Find the user's blogs
        const blogs = await Blog.find({
            author: userId
        });

        // Delete blog images from ImageKit
        for (const blog of blogs) {
            if (blog.imageFileId) {
                try {
                    await imageKitClient.files.delete(
                        blog.imageFileId
                    );
                } catch (imgError) {
                    console.error(
                        `Blog image deletion failed for ${blog._id}:`,
                        imgError.message || imgError
                    );
                }
            }
        }

        // Delete comments written by this user
        await Comment.deleteMany({
            createdBy: userId
        });

        // Delete comments belonging to the user's blogs
        const blogIds = blogs.map(blog => blog._id);

        await Comment.deleteMany({
            blogId: { $in: blogIds }
        });

        // Delete the user's blogs
        await Blog.deleteMany({
            author: userId
        });

        // Delete the user
        await user.deleteOne();

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export {
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
    signup,
    verifySignupOTP,
    completeSignup,
    signIn,
    googleSignIn,
    signOut,
    getCurrentUser,
    editProfile,
    requestEmailChange,
    verifyEmailChange,
    deleteUser
};