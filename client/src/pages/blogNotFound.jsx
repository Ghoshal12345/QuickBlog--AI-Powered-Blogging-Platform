import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function BlogNotFound() {

    const navigate = useNavigate();

    return (
        <motion.div
            className="min-h-screen bg-gray-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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

                {/* Illustration */}
                <motion.div
                    className="relative flex justify-center"
                    initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                >

                    <motion.div
                        className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center rotate-3"
                        animate={{
                            y: [0, -5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >

                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/25 -rotate-3">

                            <span className="text-white text-4xl font-bold">
                                Q
                            </span>

                        </div>

                    </motion.div>

                </motion.div>


                {/* Text */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.15,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                >

                    <p className="text-sm font-semibold text-primary uppercase tracking-widest">
                        Blog unavailable
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mt-3">
                        Blog not found
                    </h1>

                    <p className="text-gray-500 mt-4 max-w-md mx-auto leading-6">
                        The blog you're looking for may have been deleted,
                        unpublished, or the link may be incorrect.
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
                            Explore Blogs
                        </Link>
                    </motion.div>

                    <motion.button
                        type="button"
                        onClick={() => navigate(-1)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto px-7 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer"
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

export default BlogNotFound;