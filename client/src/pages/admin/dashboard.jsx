import React, { useState, useEffect } from 'react'
import { assets, dashboard_data } from '../../assets/assets';
import BlogTableItem from '../../components/admin/BlogTableItem';
import api from "../../api/axios.js";
import toast from 'react-hot-toast';
import { DashboardSkeleton } from "../../components/ui/skeletons.jsx";
import { motion } from 'motion/react';

function Dashboard() {
    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = React.useState({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: [],
    });

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/admin/dashboard');
            setDashboardData({
                blogs: data.dashboardData.totalBlogs,
                comments: data.dashboardData.totalComments,
                drafts: data.dashboardData.totalDrafts,
                recentBlogs: data.dashboardData.recentBlogs
            });
        } catch (error) {
            toast.error("Error fetching dashboard data");
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboard();
    }, [])

    return (
        <motion.div
            className="p-4 sm:p-6 lg:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.45,
                ease: "easeOut"
            }}
        >

            {/* Page Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    ease: "easeOut"
                }}
            >
                <h1 className="text-2xl font-semibold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of your blog platform
                </p>
            </motion.div>

            {loading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    {/* Statistics */}

                    {/* Recent Blogs */}


                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {/* Blogs */}
                        <motion.div
                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.1,
                                ease: "easeOut"
                            }}
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Total Blogs
                                    </p>

                                    <p className="text-3xl font-semibold text-gray-800 mt-2">
                                        {dashboardData.blogs}
                                    </p>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <img
                                        src={assets.dashboard_icon_1}
                                        alt="Blogs"
                                        className="w-6 h-6"
                                    />
                                </div>

                            </div>
                        </motion.div>


                        {/* Comments */}
                        <motion.div
                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.18,
                                ease: "easeOut"
                            }}
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Total Comments
                                    </p>

                                    <p className="text-3xl font-semibold text-gray-800 mt-2">
                                        {dashboardData.comments}
                                    </p>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <img
                                        src={assets.dashboard_icon_2}
                                        alt="Comments"
                                        className="w-6 h-6"
                                    />
                                </div>

                            </div>
                        </motion.div>


                        {/* Drafts */}
                        <motion.div
                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.26,
                                ease: "easeOut"
                            }}
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Total Drafts
                                    </p>

                                    <p className="text-3xl font-semibold text-gray-800 mt-2">
                                        {dashboardData.drafts}
                                    </p>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <img
                                        src={assets.dashboard_icon_3}
                                        alt="Drafts"
                                        className="w-6 h-6"
                                    />
                                </div>

                            </div>
                        </motion.div>

                    </div>


                    {/* Recent Blogs */}
                    <motion.div
                        className="mt-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.32,
                            ease: "easeOut"
                        }}
                    >

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <img
                                    src={assets.dashboard_icon_4}
                                    alt="Recent blogs"
                                    className="w-5 h-5"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Recent Blogs
                                </h2>

                                <p className="text-xs text-gray-400">
                                    Recently added blogs
                                </p>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: 0.38,
                            ease: "easeOut"
                        }}
                    >

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            #
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Blog Title
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dashboardData.recentBlogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-12 text-center">
                                                <p className="text-sm text-gray-400">
                                                    No recent blogs
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (

                                        dashboardData.recentBlogs.map(
                                            (blog, index) => (
                                                <BlogTableItem
                                                    key={blog._id || index}
                                                    blog={blog}
                                                    fetchBlogs={fetchDashboard}
                                                    index={index + 1}
                                                />
                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </motion.div>
                </>
            )}

        </motion.div>
    );
}

export default Dashboard;