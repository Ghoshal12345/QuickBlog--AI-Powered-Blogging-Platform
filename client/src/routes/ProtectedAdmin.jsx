import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "motion/react";

function ProtectedAdmin() {

    const { isAuthenticated, authLoading, user } = useSelector(
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

    if (user?.role !== 'admin') {
        // toast.error('Unauthorized Access!');
        // in future we will apply with useEffect hook to show toast message when user is not admin
        console.log("ProtectedAdmin rejected user:", user);
        return <Navigate to="/user/profile" replace />;
    }

    console.log("ProtectedAdmin: ADMIN ALLOWED");

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

export default ProtectedAdmin;


/*
useNavigate is a hook that returns a function . Use this when navigation should happen as a direct reaction to an event (like clicking a button, completing an API request, or submitting a form).

Navigate is a component that lets you navigate declaratively, Use this when you want React to redirect as a consequence of the current component state or authentication status during the render cycle.



difference b/w Link tag and useNavigate hook:
1. Link tag is used to navigate to a different route when the user clicks on it. It is a declarative way of navigation.
2. useNavigate hook is used to programmatically navigate to a different route. It is an imperative way of navigation.
*/