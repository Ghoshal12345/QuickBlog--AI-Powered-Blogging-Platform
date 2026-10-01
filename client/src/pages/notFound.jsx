import React from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { motion } from "motion/react";

function NotFound() {

    const error = useRouteError();

    let errorMessage = "The page you're looking for doesn't exist.";

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            errorMessage = "Sorry, we couldn't find the page you're looking for.";
        }
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >

            <motion.div
                className="w-full max-w-xl text-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut"
                }}
            >

                {/* 404 */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                >

                    <h1 className="text-[140px] sm:text-[180px] leading-none font-bold text-primary/10 select-none">
                        404
                    </h1>

                    <div className="absolute inset-0 flex items-center justify-center">

                        <motion.div
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/25 rotate-3"
                            animate={{
                                y: [0, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >

                            <span className="text-white text-4xl sm:text-5xl font-bold -rotate-3">
                                Q
                            </span>

                        </motion.div>

                    </div>

                </motion.div>


                {/* Text */}
                <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.15,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                >

                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        Page not found
                    </h2>

                    <p className="text-gray-500 mt-3 max-w-md mx-auto leading-6">
                        {errorMessage}
                    </p>

                </motion.div>


                {/* Actions */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.25,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                >

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto"
                    >
                        <Link
                            to="/"
                            className="block w-full sm:w-auto px-7 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
                        >
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.button
                        type="button"
                        onClick={() => window.history.back()}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto px-7 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Go Back
                    </motion.button>

                </motion.div>


                {/* Branding */}
                <motion.p
                    className="mt-10 text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.35,
                        duration: 0.4
                    }}
                >
                    QuickBlog · Explore. Write. Share.
                </motion.p>

            </motion.div>

        </motion.div>
    );
}

export default NotFound;