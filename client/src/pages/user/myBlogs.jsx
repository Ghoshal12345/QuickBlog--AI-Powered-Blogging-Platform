import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { MyBlogsSkeleton } from '../../components/ui/skeletons.jsx';
import { motion, AnimatePresence } from 'motion/react';

function MyBlogs() {

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [isToggling, setIsToggling] = useState(false);


    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/blog/my-blogs');
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast.error(
                error.response?.data?.message || "Failed to load your blogs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);


    // Delete Blog
    const handleDelete = async (blogId) => {
        try {
            setDeletingId(blogId);
            await api.delete(`/api/blog/id/${blogId}`);
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
            toast.success("Blog deleted successfully");
            setBlogToDelete(null);
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete the blog"
            );
        } finally {
            setDeletingId(null);
        }
    }

    // Toggle Publish Status
    const togglePublishStatus = async (blogId) => {
        try {
            setIsToggling(true);
            const { data } = await api.patch('/api/blog/toggle-publish', { id: blogId });
            toast.success(data.isPublished
                ? "Blog published successfully"
                : "Blog moved to draft"
            );
            await fetchBlogs();
        } catch (error) {
            console.error("Error updating publish status:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update publish status"
            );
        } finally {
            setIsToggling(false);
        }
    };

    // Loading state
    if (loading) {
        return <MyBlogsSkeleton />;
    }

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
                staggerChildren: 0.08
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
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        My Blogs
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your blogs, drafts, and publishing status
                    </p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Link
                        to="/user/add-blog"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition"
                    >
                        <span className="text-lg leading-none">
                            +
                        </span>

                        Add New Blog
                    </Link>
                </motion.div>

            </motion.div>


            {/* Blog count */}
            {blogs.length > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-sm text-gray-500"
                >
                    {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
                </motion.div>
            )}


            {/* Empty state */}
            {blogs.length === 0 && (

                <motion.div
                    variants={itemVariants}
                    className="bg-white border border-gray-200 rounded-2xl p-10 text-center"
                >

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                        className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl"
                    >
                        +
                    </motion.div>

                    <h2 className="text-lg font-semibold text-gray-800 mt-5">
                        No blogs yet
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                        You haven't created any blogs yet. Start writing
                        your first blog and share your ideas with the world.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link
                            to="/user/add-blog"
                            className="inline-block mt-5 bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition"
                        >
                            Create Your First Blog
                        </Link>
                    </motion.div>

                </motion.div>

            )}


            {/* Blog List */}
            {blogs.length > 0 && (

                <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                >

                    {blogs.map((blog) => (

                        <motion.div
                            key={blog._id}
                            variants={itemVariants}
                            whileHover={{
                                y: -3,
                                transition: {
                                    duration: 0.2
                                }
                            }}
                            className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:border-primary/20 transition"
                        >

                            <div className="flex flex-col sm:flex-row gap-5">


                                {/* Blog Image */}
                                <Link
                                    to={`/blog/${blog._id}`}
                                    className="w-full sm:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 block group"
                                >
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>


                                {/* Blog Information */}
                                <div className="flex-1 min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                            {blog.category}
                                        </span>


                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.isPublished
                                                ? "bg-green-50 text-green-600"
                                                : "bg-yellow-50 text-yellow-600"
                                                }`}
                                        >
                                            {blog.isPublished
                                                ? "Published"
                                                : "Draft"}
                                        </span>

                                    </div>


                                    <h2 className="text-lg font-semibold text-gray-800 mt-3 line-clamp-2">
                                        <Link
                                            to={`/blog/${blog._id}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {blog.title}
                                        </Link>
                                    </h2>


                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {blog.subTitle}
                                    </p>


                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        {/* Edit */}
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Link
                                                to={`/user/edit-blog/${blog._id}`}
                                                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-lg"
                                            >
                                                Edit
                                            </Link>
                                        </motion.div>


                                        {/* Publish / Unpublish */}
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => togglePublishStatus(blog._id)}
                                                disabled={isToggling}
                                                className={`inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg ${blog.isPublished
                                                    ? "border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white"
                                                    : "border-green-200 text-green-600 hover:bg-green-500 hover:text-white"
                                                    }`}
                                            >
                                                {isToggling
                                                    ? "Updating..."
                                                    : blog.isPublished
                                                        ? "Unpublish"
                                                        : "Publish"
                                                }
                                            </button>
                                        </motion.div>


                                        {/* Delete */}
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setBlogToDelete(blog)}
                                                disabled={deletingId === blog._id}
                                                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-red-50 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg"
                                            >
                                                {deletingId === blog._id
                                                    ? "Deleting..."
                                                    : "Delete"
                                                }
                                            </button>
                                        </motion.div>

                                    </div>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </motion.div>

            )}


            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {blogToDelete && (

                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >

                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setBlogToDelete(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />


                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
                            initial={{
                                opacity: 0,
                                scale: 0.92,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10
                            }}
                            transition={{
                                duration: 0.25,
                                ease: "easeOut"
                            }}
                        >

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.08,
                                    duration: 0.25,
                                    ease: "easeOut"
                                }}
                                className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl mx-auto"
                            >
                                !
                            </motion.div>


                            {/* Heading */}
                            <div className="text-center mt-4">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Delete this blog?
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 leading-6">
                                    Are you sure you want to delete
                                    <span className="font-medium text-gray-700">
                                        {" "}{blogToDelete.title}
                                    </span>
                                    ? This action cannot be undone.
                                </p>

                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">

                                <motion.button
                                    type="button"
                                    onClick={() => setBlogToDelete(null)}
                                    disabled={deletingId === blogToDelete._id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={() => handleDelete(blogToDelete._id)}
                                    disabled={deletingId === blogToDelete._id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deletingId === blogToDelete._id
                                        ? "Deleting..."
                                        : "Delete Blog"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default MyBlogs;