import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    otpHash: {
        type: String,
        required: true
    },

    otpExpiresAt: {
        type: Date,
        required: true
    },

    purpose: {
        type: String,
        enum: ['signup', 'reset-password', 'email-change'],
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

otpSchema.index(
    { email: 1, purpose: 1 },
    { unique: true }
);

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;