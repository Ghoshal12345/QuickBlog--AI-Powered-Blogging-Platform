import React from 'react'
import { Outlet } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import NavBar from '../components/navBar.jsx';
import { motion } from 'motion/react';

function UserLayout() {
    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <NavBar />

            {/* User Dashboard */}
            <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">

                {/* Sidebar */}
                <motion.aside
                    className="w-64 shrink-0"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >

                    <div className="bg-white rounded-xl border border-gray-200 p-5">

                        <motion.h2
                            className="text-xl font-semibold text-gray-800 mb-6"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.35,
                                delay: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            Dashboard
                        </motion.h2>

                        <nav className="flex flex-col gap-2">

                            <NavLink
                                to="/user/profile"
                                end
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg text-sm transition ${ 
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Profile
                            </NavLink>

                            <NavLink
                                to="/user/my-blogs"
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg text-sm transition ${ 
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`
                                }
                            >
                                My Blogs
                            </NavLink>

                            <NavLink
                                to="/user/add-blog"
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg text-sm transition ${ 
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Add Blog
                            </NavLink>

                        </nav>

                    </div>

                </motion.aside>


                {/* Main Content */}
                <motion.main
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.15,
                        ease: "easeOut"
                    }}
                >

                    <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-125">

                        <Outlet />

                    </div>

                </motion.main>

            </div>

        </motion.div>
    );
}

export default UserLayout;