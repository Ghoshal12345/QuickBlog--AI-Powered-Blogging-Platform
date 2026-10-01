import React from 'react'
import { Outlet } from 'react-router-dom';
import NavBar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';
import { motion } from 'motion/react';

function MainLayout() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <NavBar />
            <Outlet />
            <Footer />
        </motion.div>
    )
}

export default MainLayout;