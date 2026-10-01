import React from 'react'
import { assets } from '../../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios.js'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../redux/authSlice.js';
import { motion } from 'motion/react';

function AdminHeader() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    };

    return (
        <motion.header
            className="h-17.5 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 lg:px-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >

            {/* Logo */}
            <Link to="/">
                <motion.img
                    src={assets.logo}
                    alt="Logo"
                    className="w-32 sm:w-40 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                />
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                <motion.div
                    className="hidden sm:block text-right"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >
                    <p className="text-sm font-medium text-gray-700">
                        Admin Panel
                    </p>
                    <p className="text-xs text-gray-400">
                        Manage your blog
                    </p>
                </motion.div>

                <motion.button
                    onClick={logout}
                    className="px-5 sm:px-7 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:opacity-90 transition cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                >
                    Logout
                </motion.button>

            </div>

        </motion.header>
    );
}

export default AdminHeader;