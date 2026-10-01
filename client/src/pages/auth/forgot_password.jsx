import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

function ForgotPassword() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (step === 1) {
                // Step 1: Send OTP to the user's email
                await api.post("/api/user/forgot-password", { email });
                toast.success("OTP sent to your email");
                setStep(2); // Move to step 2 for OTP verification
                setIsSubmitting(false);
            }
            else if (step === 2) {
                setIsSubmitting(true);
                await api.post("/api/user/verify-reset-password-otp", { email, otp });
                toast.success("OTP verified successfully");
                setStep(3); // Move to step 3 for password reset
                setIsSubmitting(false);
            }
            else if (step === 3) {
                setIsSubmitting(true);
                if(password.length < 6) {
                    toast.error("Password must be at least 6 characters long");
                    setIsSubmitting(false);
                    return;
                }
                if(password !== confirmPassword) {
                    toast.error("Passwords do not match");
                    setIsSubmitting(false);
                    return;
                }
                await api.post("/api/user/reset-password", { email, password });
                toast.success("Password reset successfully");
                navigate("/login"); // Redirect to login page after successful password reset
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed");
            console.error(error.response?.data?.message || "Password reset failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                className="w-full max-w-sm p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >

                <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                >
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={step}
                            className="text-3xl font-bold text-primary"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            {step === 1
                                ? "Forgot Password"
                                : step === 2
                                    ? "Verify Email"
                                    : "Reset Password"
                            }
                        </motion.h1>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`description-${step}`}
                            className="font-light text-sm text-gray-500 mt-1"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, delay: 0.03 }}
                        >
                            {step === 1
                                ? "Enter your email to reset your password"
                                : step === 2
                                    ? "Enter the OTP sent to your email"
                                    : "Create a new password for your account"
                            }
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                <form onSubmit={handleSubmit} className="w-full mt-6 text-gray-600">

                    <AnimatePresence mode="wait">

                        {/* STEP 1 — EMAIL */}
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                className="flex flex-col mb-6"
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <label
                                    htmlFor="forgot-email"
                                    className="text-sm font-medium mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                                />
                            </motion.div>
                        )}

                        {/* STEP 2 — OTP */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                className="flex flex-col mb-6"
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <label
                                    htmlFor="reset-otp"
                                    className="text-sm font-medium mb-1"
                                >
                                    Verification Code
                                </label>
                                <input
                                    id="reset-otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    OTP is valid for 10 minutes.
                                </p>
                            </motion.div>
                        )}

                        {/* STEP 3 — NEW PASSWORD */}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="flex flex-col mb-6">
                                    <label
                                        htmlFor="new-password"
                                        className="text-sm font-medium mb-1"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col mb-6">
                                    <label
                                        htmlFor="confirm-new-password"
                                        className="text-sm font-medium mb-1"
                                    >
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-new-password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* SUBMIT BUTTON */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-medium text-white bg-primary py-3 rounded cursor-pointer hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                    >
                        {isSubmitting
                            ? "Processing..."
                            : step === 1
                                ? "Send OTP"
                                : step === 2
                                    ? "Verify OTP"
                                    : "Reset Password"
                        }
                    </motion.button>

                </form>

                {/* BACK TO LOGIN */}
                <motion.p
                    className="text-center text-sm text-gray-500 mt-6"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                >
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Login
                    </Link>
                </motion.p>

            </motion.div>
        </motion.div>
    );
}

export default ForgotPassword;