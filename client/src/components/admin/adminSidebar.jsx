import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { motion } from 'motion/react';

function AdminSidebar() {
    return (
        <motion.aside
            className="w-16 md:w-64 shrink-0 bg-white border-r border-gray-200 min-h-full"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.45,
                ease: "easeOut"
            }}
        >
            <div className="flex flex-col pt-6">

                {/* Main */}
                <motion.div
                    className="px-3 md:px-5 mb-3"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >
                    <p className="hidden md:block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Main
                    </p>
                </motion.div>

                {/* Dashboard */}
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.15,
                        ease: "easeOut"
                    }}
                    whileHover={{ x: 2 }}
                >
                    <NavLink
                        end
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-6 cursor-pointer transition ${isActive
                                ? "bg-primary/10 text-primary border-r-4 border-primary"
                                : "text-gray-600 hover:bg-gray-50"
                            }`
                        }
                    >
                        <img
                            src={assets.home_icon}
                            className="w-5 h-5 shrink-0"
                            alt="Dashboard"
                        />
                        <p className="hidden md:block text-sm font-medium">
                            Dashboard
                        </p>
                    </NavLink>
                </motion.div>


                {/* Blogs */}
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.2,
                        ease: "easeOut"
                    }}
                    whileHover={{ x: 2 }}
                >
                    <NavLink
                        to="/admin/blogs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-6 cursor-pointer transition ${isActive
                                ? "bg-primary/10 text-primary border-r-4 border-primary"
                                : "text-gray-600 hover:bg-gray-50"
                            }`
                        }
                    >
                        <img
                            src={assets.list_icon}
                            className="w-5 h-5 shrink-0"
                            alt="Blogs"
                        />
                        <p className="hidden md:block text-sm font-medium">
                            Blogs
                        </p>
                    </NavLink>
                </motion.div>


                {/* Comments */}
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.25,
                        ease: "easeOut"
                    }}
                    whileHover={{ x: 2 }}
                >
                    <NavLink
                        to="/admin/comments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-6 cursor-pointer transition ${isActive
                                ? "bg-primary/10 text-primary border-r-4 border-primary"
                                : "text-gray-600 hover:bg-gray-50"
                            }`
                        }
                    >
                        <img
                            src={assets.comment_icon}
                            className="w-5 h-5 shrink-0"
                            alt="Comments"
                        />
                        <p className="hidden md:block text-sm font-medium">
                            Comments
                        </p>
                    </NavLink>
                </motion.div>

            </div>
        </motion.aside>
    );
}

export default AdminSidebar;