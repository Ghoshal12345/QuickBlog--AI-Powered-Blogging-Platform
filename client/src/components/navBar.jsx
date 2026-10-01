import React from 'react';
import { assets } from '../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { logoutSuccess } from '../redux/authSlice.js';
import { motion } from 'motion/react';
// import { useTheme } from '../context/ThemeContext.jsx';

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { darkMode, toggleDarkMode } = useTheme();
    const { isAuthenticated, authLoading, user } = useSelector(
        (state) => state.auth
    );

    if (authLoading) return null;

    const logout = async () => {
        try {
            await api.post('/api/user/signOut');
            dispatch(logoutSuccess());
            toast.success("Logged out successfully");
            navigate('/', { replace: true });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Logout failed"
            );
            console.error("Logout error:", error);
        }
    }

    return (
        <motion.div
            className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >

            <Link to='/'>
                <motion.img
                    src={assets.logo}
                    alt="Logo"
                    className='w-32 sm:w-44 cursor-pointer'
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                />
            </Link>

            <motion.div
                className='flex items-center gap-3'
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.35,
                    delay: 0.1,
                    ease: "easeOut"
                }}
            >
                {/* Theme Toggle Button
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                    title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button> */}

                {!isAuthenticated ? (

                    <motion.button
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'
                    >
                        Login

                        <img
                            src={assets.arrow}
                            alt="Arrow"
                            className='w-3'
                        />
                    </motion.button>

                ) : (

                    <>
                        <motion.button
                            onClick={() =>
                                navigate(
                                    user?.role === "admin"
                                        ? "/admin"
                                        : "/user"
                                )
                            }
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-8 py-2.5'
                        >
                            Dashboard

                            <img
                                src={assets.arrow}
                                alt="Arrow"
                                className='w-3'
                            />
                        </motion.button>

                        <motion.button
                            onClick={logout}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className='inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer'
                        >
                            Logout
                        </motion.button>
                    </>

                )}

            </motion.div>
        </motion.div>
    )
}

export default NavBar;