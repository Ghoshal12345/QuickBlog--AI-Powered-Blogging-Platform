import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Moment from 'moment';
import api from '../api/axios.js';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { BlogSkeleton } from '../components/ui/skeletons.jsx';
import { motion, AnimatePresence } from 'motion/react';

function Blog() {

    const { id } = useParams();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);

    const [newComment, setNewComment] = useState({
        content: ''
    });

    const [isAddingComment, setIsAddingComment] = useState(false);

    // Comment menu
    const [openMenuId, setOpenMenuId] = useState(null);

    // Comment editing
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isEditingComment, setIsEditingComment] = useState(false);

    // Comment deletion
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isDeletingComment, setIsDeletingComment] = useState(false);


    // Fetch blog and comments
    const fetchBlogDataAndComments = async () => {
        try {
            const { data } = await api.get(
                `/api/blog/id/${id}`
            );
            setBlog(data.blog);
            setComments(data.blog.comments || []);
            console.log(
                "Fetched comments:",
                data.blog.comments
            );
        } catch (error) {
            console.error("Error fetching blog data:", error);
            if (error.response?.status === 404) {
                navigate("/blog-not-found", { replace: true });
                return;
            }
            toast.error(
                error.response?.data?.message ||
                "Failed to load blog"
            );
        }
    };


    useEffect(() => {
        fetchBlogDataAndComments();
    }, [id, navigate]);


    // Add comment
    const addComment = async (e) => {
        e.preventDefault();
        const content = newComment.content;
        const blogId = id;
        try {
            setIsAddingComment(true);
            await api.post(
                '/api/blog/add-comment',
                {
                    content,
                    blogId
                }
            );
            setNewComment({
                content: ''
            });
            toast.success(
                "Comment added for review. It will be visible once approved."
            );
        } catch (error) {
            console.error(
                "Error adding comment:",
                error
            );
            toast.error(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        } finally {
            setIsAddingComment(false);
        }
    };


    // Edit comment
    const editComment = async (commentId) => {
        if (!editContent.trim()) {
            toast.error(
                "Comment cannot be empty"
            );
            return;
        }
        try {
            setIsEditingComment(true);
            await api.patch(
                `/api/blog/comment/${commentId}`,
                {
                    content: editContent
                }
            );
            toast.success(
                "Comment updated and sent for review"
            );
            setEditingCommentId(null);
            setEditContent('');
            await fetchBlogDataAndComments();
        } catch (error) {
            console.error(
                "Error editing comment:",
                error
            );
            toast.error(
                error.response?.data?.message ||
                "Failed to update comment"
            );
        } finally {
            setIsEditingComment(false);
        }
    };


    // Delete comment
    const deleteComment = async () => {
        if (!commentToDelete) {
            return;
        }

        try {
            setIsDeletingComment(true);
            await api.delete(`/api/blog/comment/${commentToDelete._id}`);
            toast.success("Comment deleted successfully");
            setCommentToDelete(null);
            await fetchBlogDataAndComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete comment");
            console.error("Error deleting comment:", error);
        } finally {
            setIsDeletingComment(false);
        }
    };


    const pageVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.45,
                ease: "easeOut"
            }
        }
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            y: 14
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: "easeOut"
            }
        }
    };


    return blog ? (
        <motion.div
            className="relative bg-white min-h-screen pb-12 animate-fade-in"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background */}
            <img
                src={assets.gradientBackground}
                alt=""
                aria-hidden="true"
                className="absolute -top-50 -z-1 opacity-40 w-full object-cover pointer-events-none"
            />

            {/* ================= BLOG HEADER ================= */}
            <motion.header
                className="text-center mt-24 text-gray-600 px-5"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.span
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut"
                    }}
                    className="inline-block py-1 px-3 rounded-full mb-4 border text-xs font-semibold tracking-wide uppercase border-primary/30 bg-primary/5 text-primary"
                >
                    {Moment(blog.createdAt).format('MMMM Do, YYYY')}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.08,
                        duration: 0.45,
                        ease: "easeOut"
                    }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bold max-w-4xl mx-auto text-gray-900 leading-tight tracking-tight"
                >
                    {blog.title}
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.16,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    className="mt-6 mb-8 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto leading-relaxed"
                >
                    {blog.subTitle}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.22,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    className="flex items-center justify-center gap-3 mb-10"
                >

                    {blog.author?.profileImage ? (
                        <motion.img
                            src={blog.author.profileImage}
                            alt="Author profile"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
                        />
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0 shadow-sm"
                        >
                            {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                        </motion.div>
                    )}


                    <div className="text-left">
                        <p className="font-semibold text-gray-800 text-sm">{blog.author?.name || 'Unknown Author'}</p>
                        <p className="text-xs text-gray-500">Author</p>
                    </div>
                </motion.div>
            </motion.header>

            <main className="mx-5 max-w-4xl md:mx-auto mt-6">
                {/* Blog Image */}
                <motion.div
                    className="overflow-hidden rounded-3xl shadow-xl shadow-primary/5 mb-12"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                >
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </motion.div>

                {/* Blog Content */}
                <motion.article
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.25,
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                    className="rich-text max-w-3xl mx-auto prose prose-lg prose-blue text-gray-700 leading-loose"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                <motion.hr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.35,
                        duration: 0.4
                    }}
                    className="max-w-3xl mx-auto my-16 border-gray-100"
                />

                {/* ================= SHARE SECTION ================= */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.45,
                        ease: "easeOut"
                    }}
                    className="max-w-3xl mx-auto mb-16 flex flex-col items-center sm:flex-row sm:justify-between bg-primary/5 rounded-2xl p-6 border border-primary/10"
                >
                    <p className="font-semibold text-gray-800 mb-4 sm:mb-0">
                        Enjoyed this article? Share it!
                    </p>
                    <div className="flex gap-4">
                        {[
                            { icon: assets.facebook_icon, alt: 'Facebook' },
                            { icon: assets.twitter_icon, alt: 'Twitter' },
                            { icon: assets.googleplus_icon, alt: 'Google+' }
                        ].map((social, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{
                                    y: -3,
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                transition={{
                                    duration: 0.15
                                }}
                                className="hover:-translate-y-1 hover:shadow-md transition-all duration-300 rounded-full bg-white p-2 shadow-sm border border-gray-100 cursor-pointer"
                            >
                                <img src={social.icon} width={24} height={24} alt={social.alt} />
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* ================= COMMENTS SECTION ================= */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.35,
                        duration: 0.45,
                        ease: "easeOut"
                    }}
                    className="max-w-3xl mx-auto mb-12"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Comments <span className="text-primary/70 text-lg">({comments.length})</span>
                        </h3>
                    </div>

                    {/* Comment List */}
                    <motion.div
                        className="flex flex-col gap-5 mb-12"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {comments.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
                                >
                                    <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                                </motion.div>
                            ) : (
                                comments.map((comment) => (
                                    <motion.div
                                        key={comment._id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{
                                            y: -2,
                                            transition: {
                                                duration: 0.2
                                            }
                                        }}
                                        className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 rounded-2xl text-gray-700"
                                    >
                                        {/* Comment Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {comment.createdBy?.profileImage ? (
                                                    <motion.img
                                                        src={comment.createdBy.profileImage}
                                                        alt={`${comment.createdBy.name}'s profile`}
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-9 h-9 rounded-full object-cover shadow-sm shrink-0"
                                                    />
                                                ) : (
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0"
                                                    >
                                                        {comment.createdBy?.name?.charAt(0).toUpperCase() || '?'}
                                                    </motion.div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-900">
                                                        {comment.createdBy?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {Moment(comment.createdAt).fromNow()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Three Dot Menu */}
                                            {user?._id === comment.createdBy?._id && (
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                                                    >
                                                        ⋮
                                                    </button>

                                                    {/* Menu Dropdown */}
                                                    <AnimatePresence>
                                                        {openMenuId === comment._id && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.95,
                                                                    y: -5
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                    y: 0
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    scale: 0.95,
                                                                    y: -5
                                                                }}
                                                                transition={{
                                                                    duration: 0.15,
                                                                    ease: "easeOut"
                                                                }}
                                                                className="absolute right-0 top-9 z-20 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in origin-top-right"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment._id);
                                                                        setEditContent(comment.content);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setCommentToDelete(comment);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>

                                        {/* Edit Mode vs Normal Mode */}
                                        <AnimatePresence mode="wait">
                                            {editingCommentId === comment._id ? (
                                                <motion.div
                                                    key="edit"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{
                                                        duration: 0.25,
                                                        ease: "easeOut"
                                                    }}
                                                    className="mt-4 overflow-hidden"
                                                >
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y text-sm transition-all bg-gray-50"
                                                        disabled={isEditingComment}
                                                        rows={3}
                                                    />
                                                    <div className="flex items-center justify-end gap-2 mt-3">
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingCommentId(null);
                                                                setEditContent('');
                                                            }}
                                                            disabled={isEditingComment}
                                                            whileHover={!isEditingComment ? { scale: 1.03 } : {}}
                                                            whileTap={!isEditingComment ? { scale: 0.97 } : {}}
                                                            className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </motion.button>
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => editComment(comment._id)}
                                                            disabled={isEditingComment || !editContent.trim() || editContent === comment.content}
                                                            whileHover={
                                                                !isEditingComment && editContent.trim() && editContent !== comment.content
                                                                    ? { scale: 1.03 }
                                                                    : {}
                                                            }
                                                            whileTap={
                                                                !isEditingComment && editContent.trim() && editContent !== comment.content
                                                                    ? { scale: 0.97 }
                                                                    : {}
                                                            }
                                                            className="px-5 py-1.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm shadow-primary/30 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:transform-none"
                                                        >
                                                            {isEditingComment ? "Saving..." : "Save Changes"}
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.p
                                                    key="content"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-sm text-gray-700 leading-relaxed pl-12"
                                                >
                                                    {comment.content}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Add Comment Form (From Previous Fix) */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                        className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm"
                    >
                        <p className="font-bold text-gray-900 mb-4">Leave a Reply</p>
                        <form onSubmit={addComment} className="flex flex-col items-end gap-4 w-full">
                            <div className="flex gap-4 w-full items-start">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Your profile" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <textarea
                                    placeholder="Write a comment..."
                                    required
                                    className="w-full p-4 border border-gray-200 bg-white rounded-xl outline-none min-h-25 focus:ring-4 focus:ring-primary/10 focus:border-primary resize-y text-sm transition-all shadow-inner"
                                    value={newComment.content}
                                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={isAddingComment}
                                whileHover={!isAddingComment ? { scale: 1.03 } : {}}
                                whileTap={!isAddingComment ? { scale: 0.97 } : {}}
                                className="bg-primary disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/30 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
                            >
                                {isAddingComment ? "Posting..." : "Post Comment"}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.section>
            </main>

            {/* ================= DELETE MODAL ================= */}
            <AnimatePresence>
                {commentToDelete && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => !isDeletingComment && setCommentToDelete(null)}
                        />

                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                            initial={{
                                opacity: 0,
                                scale: 0.94,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10
                            }}
                            transition={{
                                duration: 0.25,
                                ease: "easeOut"
                            }}
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.7
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                transition={{
                                    delay: 0.08,
                                    duration: 0.25,
                                    ease: "easeOut"
                                }}
                                className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl font-bold mb-4"
                            >
                                !
                            </motion.div>

                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900">Delete Comment?</h2>
                                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                            </div>

                            <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-600 line-clamp-3 italic">"{commentToDelete.content}"</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    type="button"
                                    onClick={() => setCommentToDelete(null)}
                                    disabled={isDeletingComment}
                                    whileHover={!isDeletingComment ? { scale: 1.02 } : {}}
                                    whileTap={!isDeletingComment ? { scale: 0.97 } : {}}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={deleteComment}
                                    disabled={isDeletingComment}
                                    whileHover={!isDeletingComment ? { scale: 1.02 } : {}}
                                    whileTap={!isDeletingComment ? { scale: 0.97 } : {}}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold shadow-md shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isDeletingComment ? "Deleting..." : "Delete"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    ) : (
        <BlogSkeleton />
    );



}

export default Blog;