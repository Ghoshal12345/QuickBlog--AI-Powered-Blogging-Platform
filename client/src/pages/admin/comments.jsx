import React, { useEffect, useState } from 'react'
import { assets, comments_data } from '../../assets/assets';
import api from "../../api/axios.js";
import toast from 'react-hot-toast';
import { AdminCommentsSkeleton } from '../../components/ui/skeletons.jsx';
import { motion, AnimatePresence } from 'motion/react';

function Comments() {


    const [comments, setComments] = useState([]);
    const [filter, setFilter] = useState('Not Approved');

    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);


    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/admin/comments');
            setComments(data.comments);
        } catch (error) {
            toast.error("Error fetching comments");
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    }

    const toggleApprove = async (commentId) => {
        try {
            setApprovingId(commentId);
            await api.patch(`/api/admin/comments/${commentId}`);
            toast.success("Comment approved successfully");
            await fetchComments();
        } catch (error) {
            toast.error("Error approving comment");
            console.error("Error approving comment:", error);
        } finally {
            setApprovingId(null);
        }
    }

    const deleteComment = async (commentId) => {
        try {
            setIsDeleting(true);
            await api.delete('/api/admin/comments/' + commentId);
            toast.success("Comment deleted successfully");
            setCommentToDelete(null);
            await fetchComments();
        } catch (error) {
            toast.error("Error deleting comment");
            console.error("Error deleting comment:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        fetchComments();
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    ease: "easeOut"
                }}
            >

                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Comments
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Review and manage comments from your readers
                    </p>
                </div>


                {/* Filters */}
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >

                    <motion.button
                        onClick={() => setFilter("Not Approved")}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition cursor-pointer ${filter === "Not Approved"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        Pending
                    </motion.button>


                    <motion.button
                        onClick={() => setFilter("Approved")}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition cursor-pointer ${filter === "Approved"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        Approved
                    </motion.button>

                </motion.div>

            </motion.div>


            {/* Comments Table */}
            {loading ? (

                <AdminCommentsSkeleton />

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

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Blog & Comment
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {comments.filter(
                                    comment =>
                                        comment.isApproved === (filter === "Approved")
                                ).length === 0 ? (

                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">

                                            <p className="text-sm text-gray-400">
                                                No {filter === "Approved"
                                                    ? "approved"
                                                    : "pending"} comments found
                                            </p>

                                        </td>
                                    </tr>

                                ) : (

                                    comments
                                        .filter(
                                            comment =>
                                                comment.isApproved ===
                                                (filter === "Approved")
                                        )
                                        .map((comment, index) => (
                                            <motion.tr
                                                key={comment._id}
                                                className="border-b border-gray-100 hover:bg-gray-50/70 transition"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                    ease: "easeOut"
                                                }}
                                            >

                                                {/* Comment */}
                                                <td className="px-6 py-5">

                                                    <div className="max-w-2xl">

                                                        <p className="text-sm font-medium text-gray-700">
                                                            {comment.blogId?.title}
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-2">
                                                            By {comment.createdBy?.name}
                                                        </p>

                                                        <p className="text-sm text-gray-600 mt-2 leading-6">
                                                            {comment.content}
                                                        </p>

                                                    </div>

                                                </td>


                                                {/* Date */}
                                                <td className="px-6 py-5 hidden md:table-cell text-gray-500 whitespace-nowrap">
                                                    {new Date(
                                                        comment.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </td>


                                                {/* Actions */}
                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-2">

                                                        {!comment.isApproved ? (

                                                            <motion.button
                                                                onClick={() => toggleApprove(comment._id)}
                                                                disabled={approvingId === comment._id}
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                className="px-3  py-1.5 disabled:cursor-not-allowed rounded-full text-xs font-medium border border-green-200 text-green-600 hover:bg-green-50 transition cursor-pointer"
                                                            >
                                                                {approvingId === comment._id
                                                                    ? "Approving..."
                                                                    : "Approve"}
                                                            </motion.button>

                                                        ) : (

                                                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                                                Approved
                                                            </span>

                                                        )}


                                                        <motion.button
                                                            onClick={() => setCommentToDelete(comment)}
                                                            whileHover={{ scale: 1.08 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition cursor-pointer"
                                                            title="Delete comment"
                                                        >
                                                            <img
                                                                src={assets.bin_icon}
                                                                alt="Delete"
                                                                className="w-5 h-5 hover:scale-110 transition"
                                                            />
                                                        </motion.button>

                                                    </div>

                                                </td>

                                            </motion.tr>
                                        ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </motion.div>
            )}


            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {commentToDelete && (
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
                                    setCommentToDelete(null);
                                }
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
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
                                    Delete this comment?
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 leading-6">
                                    Are you sure you want to permanently delete this comment?
                                </p>

                                <div className="mt-3 px-4 py-3 bg-gray-50 rounded-xl text-left">
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {commentToDelete.content}
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-3 mt-6">

                                <motion.button
                                    type="button"
                                    onClick={() => setCommentToDelete(null)}
                                    disabled={isDeleting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={() => deleteComment(commentToDelete._id)}
                                    disabled={isDeleting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Comment"}
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

export default Comments