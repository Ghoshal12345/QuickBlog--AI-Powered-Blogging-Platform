import React from 'react'
import { motion } from 'motion/react';
import Header from '../components/header';
import BlogList from '../components/blogList';
import NewsLetter from '../components/newsLetter.jsx';

function Home() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <Header />
            <BlogList />
            <NewsLetter />
        </motion.div>
    )
}

export default Home;