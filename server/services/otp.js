import { randomInt, createHash } from 'node:crypto';
import OTP from '../models/otp.js';
import resend from '../configs/resend.js';

function generateOTP() {
    return randomInt(100000, 1000000).toString();
}

function hashOTP(otp) {
    return createHash('sha256')
        .update(otp)
        .digest('hex');
}

async function createAndSendOTP({ email, name, purpose }) {
    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.findOneAndUpdate(
        { email, purpose },
        {
            email,
            name,
            otpHash,
            otpExpiresAt,
            purpose,
            verified: false
        },
        {
            upsert: true,//if the document doesn't exist, create a new one
            returnDocument: 'after',
            setDefaultsOnInsert: true
        }
    );

    const { data, error } = await resend.emails.send({
        from: 'quickblog <onboarding@resend.dev>',
        to: email,
        subject:
            purpose === 'signup'
                ? 'Verify your QuickBlog account'
                : purpose === 'email-change'
                    ? 'Verify your new QuickBlog email'
                    : 'Reset your QuickBlog password',
        html: `
            <div>

                <p>Your verification code is:</p>

                <h1>${otp}</h1>

                <p>This code will expire in 10 minutes.</p>

                <p>If you did not request this code, you can ignore this email.</p>
            </div>
        `
    });

    if (error) {
        console.error("Resend error:", error);

        // Remove the OTP because email delivery failed
        await OTP.deleteOne({ email, purpose });

        throw new Error("Failed to send OTP email");
    }

    return {
        emailId: data.id
    };
}

async function verifyOTP({ email, otp, purpose }) {
    const otpRecord = await OTP.findOne({ email, purpose });
    if (!otpRecord) {
        return {
            success: false,
            message: "OTP not found"
        };
    }

    if (otpRecord.verified) {
        return {
            success: false,
            message: "OTP already verified"
        };
    }

    if (otpRecord.otpExpiresAt < new Date()) {
        await OTP.deleteOne({ email, purpose });// Remove the expired OTP
        return {
            success: false,
            message: "OTP has expired"
        };
    }

    if (otpRecord.otpHash !== hashOTP(otp)) {
        return {
            success: false,
            message: "Invalid OTP"
        };
    }

    otpRecord.verified = true;
    await otpRecord.save();

    return {
        success: true,
        message: "OTP verified successfully"
    };
}

export {
    createAndSendOTP,
    verifyOTP,
};