import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { checkAuth } from "../redux/authSlice.js";

function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const { authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (authLoading) {
        return (
            <motion.div
                className="flex items-center justify-center min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                >
                    <motion.div
                        className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />

                    <motion.p
                        className="mt-4 text-gray-500 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        Loading...
                    </motion.p>
                </motion.div>
            </motion.div>
        );
    }

    return children;
}

export default AuthInitializer;