import React from 'react'
import { motion } from 'motion/react'

function NewsLetter() {
    return (
        <motion.div
            className='flex flex-col items-center justify-center text-center space-y-2 my-32 '
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <motion.h1
                className='md:text-4xl text-2xl font-semibold'
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
                Never Miss a Blog!
            </motion.h1>

            <motion.p
                className='md:text-lg text-gray-500/70 pb-8'
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
            >
                Subscribe to get the latest blog, new tech, and exclusive news
            </motion.p>

            <motion.form
                className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
            >
                <input
                    className='border border-gray-300 h-full border-r-0 outline-none w-full rounded-l-md px-3 text-gray-500'
                    type="email"
                    placeholder="Enter your email"
                    required
                />

                <motion.button
                    type="submit"
                    className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-r-md'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                >
                    Subscribe
                </motion.button>
            </motion.form>
        </motion.div>
    )
}

export default NewsLetter;