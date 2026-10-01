import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

function ProtectedRoute() {

    const { isAuthenticated, authLoading } = useSelector(
        (state) => state.auth
    );

    if (authLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            >
                Loading...
            </motion.div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.35,
                ease: "easeOut"
            }}
        >
            <Outlet />
        </motion.div>
    );
}

export default ProtectedRoute;