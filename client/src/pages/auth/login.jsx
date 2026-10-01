import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice.js";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { motion } from "motion/react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fixed: Added `user` to useSelector destructuring
    const { isAuthenticated, authLoading, user } = useSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (authLoading) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >

                    {/* Logo / Loading Icon */}
                    <motion.div
                        className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <span className="text-white text-2xl font-bold">
                            Q
                        </span>
                    </motion.div>

                    {/* Loading text */}
                    <h2 className="mt-5 text-lg font-semibold text-gray-800">
                        QuickBlog
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        Checking your account...
                    </p>

                    {/* Spinner */}
                    <div className="mt-5 w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />

                </motion.div>
            </motion.div>
        );
    }

    if (isAuthenticated) {
        return user?.role === "admin" ? (
            <Navigate to="/admin" replace />
        ) : (
            <Navigate to="/" replace />
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data } = await api.post("/api/user/signIn", { email, password });
            dispatch(loginSuccess(data.user));

            toast.success("Logged in successfully");

            if (data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            console.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {//* Google generates it after the user successfully authenticates.
        try {
            const { data } = await api.post("/api/user/google-signin", { googleId_token: credentialResponse.credential });
            dispatch(loginSuccess(data.user));
            toast.success("Logged in successfully");

            if (data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
            console.error(error.response?.data?.message || "Google login failed");
        }
    }

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                className="w-full max-w-sm p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-3xl"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <h1 className="text-3xl font-bold text-primary">Login</h1>
                    <p className="font-light text-sm text-gray-500 mt-1">
                        Login to your account
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="w-full mt-6 text-gray-600">

                    <motion.div
                        className="flex flex-col mb-6"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                    >
                        <label htmlFor="email" className="text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                        />
                    </motion.div>

                    <motion.div
                        className="flex flex-col mb-6"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                    >
                        <label htmlFor="password" className="text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition-colors"
                        />
                    </motion.div>

                    {/* forgot password link */}
                    <motion.div
                        className="text-right -mt-3 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                    >
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary font-medium hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-medium text-white bg-primary py-3 rounded-4xl cursor-pointer hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </motion.button>

                    <motion.div
                        className="flex items-center gap-3 my-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.3 }}
                    >
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-400 font-medium">
                            OR
                        </span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </motion.div>

                    {/* Google Login */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.35 }}
                    >
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                toast.error("Google login failed");
                            }}
                            text="signin_with"
                            shape="pill"
                            size="large"
                            width="100%"
                            theme="filled_blue"
                            logo_alignment="center"
                        />
                    </motion.div>
                </form>

                <motion.p
                    className="text-center text-sm text-gray-500 mt-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                >
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary font-medium hover:underline">
                        Sign Up
                    </Link>
                </motion.p>
            </motion.div>
        </motion.div>
    );
}

export default Login;