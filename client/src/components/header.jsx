import React, { useRef } from 'react'
import { assets } from '../assets/assets.js'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../redux/blogSlice.js';
import { motion, AnimatePresence } from 'motion/react';

function Header() {
    const dispatch = useDispatch();
    const inputRef = useRef(null)

    const handleSearch = async (e) => {
        e.preventDefault()
        const searchTerm = inputRef.current.value.trim();
        dispatch(setSearchTerm(searchTerm));
    }

    const searchTerm = useSelector((state) => state.blogs.searchTerm);

    const onClear = () => {
        const searchTerm = "";
        dispatch(setSearchTerm(searchTerm));
        inputRef.current.value = "";
    }

    return (
        <motion.div
            className='mx-8 sm:mx-16 xl:mx-24 relative'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
        >

            <div className='text-center flex-col justify-center items-center py-5'>

                <motion.div
                    className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.35,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >
                    <p>New: AI feature integrated</p>
                    <img
                        src={assets.star_icon}
                        alt="Star Icon"
                        className='w-2.5'
                    />
                </motion.div>

                <motion.h1
                    className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.15,
                        ease: "easeOut"
                    }}
                >
                    Your own <span className='text-primary'>blogging</span> <br /> platform.
                </motion.h1>

                <motion.p
                    className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.25,
                        ease: "easeOut"
                    }}
                >
                    Unleash your creativity with our AI-powered blogging platform. Generate captivating content effortlessly and take your blog to new heights.
                </motion.p>

                <motion.form
                    onSubmit={handleSearch}
                    className='flex justify-between max-w-lg max-sm:sca1e-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.3,
                        ease: "easeOut"
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search Blogs..."
                        required
                        className='w-full pl-4 outline-none'
                    />

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className=' bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'
                    >
                        Search
                    </motion.button>
                </motion.form>

            </div>

            <div className='text-center'>
                <AnimatePresence>
                    {searchTerm &&
                        <motion.button
                            onClick={onClear}
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'
                        >
                            Clear Search
                        </motion.button>
                    }
                </AnimatePresence>
            </div>

            <motion.img
                src={assets.gradientBackground}
                alt="Gradient Background"
                className='absolute -top-50 -z-1 opacity-50'
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: "easeOut"
                }}
            />

        </motion.div>
    )
}

export default Header