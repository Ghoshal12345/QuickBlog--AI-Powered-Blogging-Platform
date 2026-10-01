import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';

function Profile() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return null;
    }

    const firstLetter = user.name?.charAt(0).toUpperCase();

    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 12
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 12
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            {/* Heading */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-semibold text-gray-800">
                    My Profile
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage your account and blogging activity
                </p>
            </motion.div>


            {/* Profile Banner */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8"
            >

                {/* Decorative circle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut"
                    }}
                    className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                    className="absolute -right-5 -bottom-16 w-32 h-32 rounded-full bg-white/5"
                />


                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

                    {/* Avatar / Edit Profile */}
                    <motion.div
                        onClick={() => navigate("/user/edit-profile")}
                        whileHover={{
                            scale: 1.04
                        }}
                        whileTap={{
                            scale: 0.97
                        }}
                        transition={{
                            duration: 0.2
                        }}
                        className="group relative w-20 h-20 rounded-full shrink-0 overflow-hidden shadow-sm cursor-aliase hover:shadow-md transition-shadow cursor-pointer"
                        title="Edit profile"
                    >
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={`${user.name}'s profile`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-white text-primary flex items-center justify-center text-3xl font-semibold">
                                {firstLetter}
                            </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-white text-xl">
                                ✎
                            </span>
                        </div>
                    </motion.div>


                    {/* User details */}
                    <motion.div
                        variants={itemVariants}
                        className="text-white"
                    >

                        <h2 className="text-2xl font-semibold">
                            {user.name}
                        </h2>

                        <p className="text-white/80 text-sm mt-1">
                            {user.email}
                        </p>

                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.25
                            }}
                            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium capitalize"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            {user.role}
                        </motion.span>

                    </motion.div>

                </div>

            </motion.div>


            {/* Information Cards */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >

                {/* Account Information */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{
                        y: -3,
                        transition: {
                            duration: 0.2
                        }
                    }}
                    className="bg-white border border-gray-200 rounded-2xl p-6"
                >

                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Account Information
                            </h2>

                            <p className="text-xs text-gray-400 mt-1">
                                Your account details
                            </p>
                        </div>

                    </div>


                    <div className="space-y-5">

                        {/* Name */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Full Name
                            </p>

                            <p className="text-sm font-medium text-gray-700">
                                {user.name}
                            </p>
                        </div>


                        <div className="border-t border-gray-100" />


                        {/* Email */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Email Address
                            </p>

                            <p className="text-sm font-medium text-gray-700 break-all">
                                {user.email}
                            </p>
                        </div>


                        <div className="border-t border-gray-100" />


                        {/* Role */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Account Role
                            </p>

                            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                                {user.role}
                            </span>
                        </div>

                    </div>

                </motion.div>


                {/* Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{
                        y: -3,
                        transition: {
                            duration: 0.2
                        }
                    }}
                    className="bg-white border border-gray-200 rounded-2xl p-6"
                >

                    <div className="mb-6">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Quick Actions
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            Manage your blogging activity
                        </p>

                    </div>


                    <div className="space-y-3">

                        <motion.div
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                        >
                            <Link
                                to="/user/add-blog"
                                className="group flex items-center justify-between px-4 py-4 rounded-xl bg-primary text-white hover:opacity-90 transition"
                            >

                                <div className="flex items-center gap-3">

                                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-lg">
                                        +
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Create New Blog
                                        </p>

                                        <p className="text-xs text-white/70 mt-0.5">
                                            Start writing something new
                                        </p>
                                    </div>

                                </div>

                                <span className="text-lg group-hover:translate-x-1 transition">
                                    →
                                </span>

                            </Link>
                        </motion.div>


                        <motion.div
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                        >
                            <Link
                                to="/user/my-blogs"
                                className="group flex items-center justify-between px-4 py-4 rounded-xl border border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5 transition"
                            >

                                <div className="flex items-center gap-3">

                                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                        ≡
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            View My Blogs
                                        </p>

                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Manage your published blogs
                                        </p>
                                    </div>

                                </div>

                                <span className="text-lg text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition">
                                    →
                                </span>

                            </Link>
                        </motion.div>

                    </div>

                </motion.div>

            </motion.div>

        </motion.div>
    );
}

export default Profile;