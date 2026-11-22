import { randomInt, createHash } from 'node:crypto';
import OTP from '../models/otp.js';
import { emailQueue } from '../queues/email_queue.js';


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

    try{
        await emailQueue.add(
            'sendOtp',//job name
            { email, otp, purpose },//job data(available in job.data in the worker)
            {
                // Avoid keeping a job longer than its OTP validity.
                jobId: `otp-${purpose}-${Date.now()}`,
            }
        );
        console.log(`OTP email job queued for ${email} with purpose: ${purpose}`);
    } catch (error) {
        //Remove the OTP record if the job fails to queue
        await OTP.deleteOne({ email, purpose });
        throw new Error('Failed to queue OTP email job');
    }

    return {
        queued: true,
        message: 'OTP generated and email job queued successfully'
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