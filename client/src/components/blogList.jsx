import React, { useState, useEffect } from 'react'
import { blogCategories } from '../assets/assets.js'
import { motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../redux/blogSlice.js';
// import {blog_data} from '../assets/assets.js'
import BlogCard from './blogCard.jsx';
import {BlogCardSkeleton} from './ui/skeletons.jsx';


function BlogList() {
    const dispatch = useDispatch();
    const [menu, setMenu] = useState(blogCategories[0]);

    const {
        blogs,
        loading,
        error,
        searchTerm
    } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >

            <motion.div
                className='flex justify-center gap-4 sm:gap-8 my-10 relative'
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    ease: "easeOut"
                }}
            >
                {blogCategories.map((item, index) => {
                    return (
                        <motion.div
                            key={item}
                            className='relative'
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.04,
                                ease: "easeOut"
                            }}
                        >
                            <motion.button
                                onClick={() => setMenu(item)}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className={`cursor-pointer text-gray-500 ${menu === item ? 'text-white px-4 pt-0.5 ' : ''}`}
                            >
                                {item}

                                {menu === item && (
                                    <motion.div
                                        layoutId='underline'
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30
                                        }}
                                        className="absolute left-0 top-0 right-0 h-7 -z-1 bg-primary rounded-full"
                                    />
                                )}

                            </motion.button>
                        </motion.div>
                    )
                })}
            </motion.div>


            {!loading && blogs.length === 0 && (
                <motion.div
                    className="flex flex-col items-center justify-center py-20 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                >
                    <h2 className="text-2xl font-semibold text-gray-700">
                        No blogs available
                    </h2>

                    <p className="mt-2 text-gray-500">
                        There are no published blogs to display right now.
                    </p>
                </motion.div>
            )}


            <motion.div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: "easeOut"
                }}
            >

                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <BlogCardSkeleton />
                        </motion.div>
                    ))
                ) : (
                    blogs
                        .filter((blog) =>
                            menu === "All" || blog.category === menu
                        )
                        .filter((blog) => {
                            const term = searchTerm.toLowerCase();

                            return (
                                blog.title.toLowerCase().includes(term) ||
                                blog.subTitle?.toLowerCase().includes(term)
                            );
                        })
                        .map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.06,
                                    ease: "easeOut"
                                }}
                            >
                                <BlogCard
                                    blog={blog}
                                />
                            </motion.div>
                        ))
                )}

            </motion.div>

        </motion.div>
    )
}

export default BlogList