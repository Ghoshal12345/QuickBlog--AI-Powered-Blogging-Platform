import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import api from "../../api/axios.js";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

function BlogTableItem({ blog, fetchBlogs, index }) {
    const { title, createdAt } = blog;
    const blogDate = new Date(createdAt);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const togglePublishStatus = async (e) => {
        try {
            setIsToggling(true);
            await api.patch('/api/blog/toggle-publish', { id: blog._id });
            toast.success("Publish status updated successfully");
            await fetchBlogs();
        } catch (error) {
            toast.error("Error updating publish status");
            console.error('Error updating publish status:', error);
        } finally {
            setIsToggling(false);
        }
    }

    const deleteBlog = async () => {
        try {
            setIsDeleting(true);
            await api.delete(`/api/blog/id/${blog._id}`);
            toast.success("Blog deleted successfully");
            setShowDeleteModal(false);
            await fetchBlogs();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Error deleting blog"
            );

            console.error("Error deleting blog:", error);

        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <motion.tr
                className="border-b border-gray-100 hover:bg-gray-50/70 transition"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
                whileHover={{ y: -1 }}
            >

                {/* Number */}
                <td className="px-5 py-4 text-gray-400 font-medium">
                    {index}
                </td>

                {/* Title */}
                <td className="px-5 py-4">
                    <div className="max-w-xs">
                        <p className="font-medium text-gray-700 truncate">
                            {title}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            Blog article
                        </p>
                    </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4 hidden sm:table-cell text-gray-500">
                    {blogDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })}
                </td>

                {/* Status */}
                <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${blog?.isPublished
                                ? "bg-green-50 text-green-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${blog?.isPublished
                                    ? "bg-green-500"
                                    : "bg-orange-500"
                                }`}
                        />

                        {blog?.isPublished
                            ? "Published"
                            : "Unpublished"}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">

                        <motion.button
                            onClick={togglePublishStatus}
                            disabled={isToggling}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-3 py-1.5 disabled:cursor-not-allowed rounded-full text-xs font-medium border transition cursor-pointer ${blog?.isPublished
                                    ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                                    : "border-green-200 text-green-600 hover:bg-green-50"
                                }`}
                        >
                            {isToggling
                                ? "Updating..."
                                : blog?.isPublished
                                    ? "Unpublish"
                                    : "Publish"
                            }
                        </motion.button>

                        <motion.button
                            onClick={() => setShowDeleteModal(true)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition cursor-pointer"
                            title="Delete blog"
                        >
                            <img
                                src={assets?.cross_icon}
                                className="w-5 h-5"
                                alt="Delete"
                            />
                        </motion.button>

                    </div>
                </td>

            </motion.tr>


            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >

                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => {
                                if (!isDeleting) {
                                    setShowDeleteModal(false);
                                }
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
                            initial={{
                                opacity: 0,
                                scale: 0.95,
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
                                y: 15
                            }}
                            transition={{
                                duration: 0.25,
                                ease: "easeOut"
                            }}
                        >

                            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl font-semibold">
                                !
                            </div>

                            <div className="text-center mt-4">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Delete this blog?
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 leading-6">
                                    Are you sure you want to delete
                                    <span className="font-medium text-gray-700">
                                        {" "}{blog.title}
                                    </span>
                                    ? This action cannot be undone.
                                </p>

                            </div>

                            <div className="flex gap-3 mt-6">

                                <motion.button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 cursor-pointer px-4 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={deleteBlog}
                                    disabled={isDeleting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 cursor-pointer px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Blog"}
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default BlogTableItem