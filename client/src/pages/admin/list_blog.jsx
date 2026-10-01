import React, { useState, useEffect } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem';
// import { blog_data} from '../../assets/assets';
// import { useSelector } from 'react-redux';
import api from "../../api/axios.js";
// import toast from 'react-hot-toast';
import { AdminBlogsSkeleton } from '../../components/ui/skeletons.jsx';
import { motion } from 'motion/react';


function List_blog() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/admin/blogs');
            setBlogs(data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

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

            {/* Header */}
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
                    All Blogs
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage and moderate all blogs on the platform
                </p>
            </motion.div>


            {/* Blog Table */}
            {/* Blog Table */}

            {loading ? (

                <AdminBlogsSkeleton />

            ) : (

                <motion.div
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.1,
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
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center">
                                            <p className="text-sm text-gray-400">
                                                No blogs found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((blog, index) => (
                                        <BlogTableItem
                                            key={blog._id || index}
                                            blog={blog}
                                            fetchBlogs={fetchBlogs}
                                            index={index + 1}
                                        />
                                    ))
                                )}
                            </tbody>

                        </table>

                    </div>

                </motion.div>

            )}

        </motion.div>
    );
}

export default List_blog;