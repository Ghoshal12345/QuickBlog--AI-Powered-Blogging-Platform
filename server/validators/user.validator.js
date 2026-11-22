import { z } from 'zod';

const nameSchema = z
    .string()
    .trim()
    .min(3, { message: 'Name must contain at least 3 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .regex(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' })
    .transform((name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    });

const emailSchema = z
    .string()
    .trim()
    .max(50, { message: 'Email cannot exceed 50 characters' })
    .pipe(z.email({ message: 'Invalid email address' }))
    .transform((email) => email.toLowerCase());

const otpSchema = z
    .string()
    .trim()
    .length(6, { message: 'OTP must be 6 characters long' })
    .regex(/^\d+$/, { message: 'OTP must contain only digits' });

const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(64, { message: 'Password must be at most 64 characters long' });   



const forgotPasswordSchema = z.object({
    body: z.object({
        email: emailSchema
    })
});
const verifyForgotPasswordOTPSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: otpSchema
    })
});
const resetPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema
    })
});



const signupSchema = z.object({
    body: z.object({
        name: nameSchema,
        email: emailSchema
    })
});
const verifySignupOTPSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: otpSchema
    })
});
const completeSignupSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema
    })
});



const signInSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema
    })
});
const googleSignInSchema = z.object({
    body: z.object({
        googleId_token: z.string().trim().min(1, 'Token is required')
    })
});



const editProfileSchema = z.object({
    body: z.object({
        name: nameSchema.optional()
    })
});



const requestEmailChangeSchema = z.object({
    body: z.object({
        newEmail: emailSchema
    })
});
const verifyEmailChangeSchema = z.object({
    body: z.object({
        newEmail: emailSchema,
        otp: otpSchema
    })
});



export {
    forgotPasswordSchema,
    verifyForgotPasswordOTPSchema,
    resetPasswordSchema,
    signupSchema,
    verifySignupOTPSchema,
    completeSignupSchema,
    signInSchema,
    googleSignInSchema,
    editProfileSchema,
    requestEmailChangeSchema,
    verifyEmailChangeSchema
};