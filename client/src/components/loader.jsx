import React from 'react';
import { motion } from 'motion/react';

function Loader({ message = "Loading..." }) {
    return (
        <motion.div
            className="flex flex-col justify-center items-center h-screen bg-gray-50/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {/* Outer spinning ring */}
            <motion.div
                className="relative flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut"
                }}
            >
                <div className="absolute w-16 h-16 rounded-full border-4 border-primary/20"></div>

                <motion.div
                    className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Inner pulsing dot */}
                <motion.div
                    className="w-4 h-4 bg-primary rounded-full"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [1, 0.7, 1]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Loading Text */}
            <motion.p
                className="mt-6 text-sm font-medium text-gray-500"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    delay: 0.15,
                    ease: "easeOut"
                }}
            >
                {message}
            </motion.p>
        </motion.div>
    );
}

export default Loader;