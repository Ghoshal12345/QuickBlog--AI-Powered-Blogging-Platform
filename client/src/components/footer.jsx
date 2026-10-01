import React from 'react'
import { assets } from '../assets/assets.js'
import { footer_data } from '../assets/assets.js'
import { motion } from 'motion/react'

function Footer() {
    return (
        <motion.div
            className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
        >

            <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500'>

                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.45,
                        ease: "easeOut"
                    }}
                >
                    <img
                        src={assets.logo}
                        alt="Logo"
                        className='w-32 sm:w-44'
                    />

                    <p className='max-w-102.5 mt-6 '>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti sequi doloremque vero, facilis, nemo nobis perspiciatis asperiores neque cupiditate rem fugiat tempore consectetur quo hic harum quos.
                    </p>
                </motion.div>


                <motion.div
                    className='flex flex-wrap justify-between w-full md:w-[45%] gap-5'
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.45,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >
                    {footer_data.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.35,
                                delay: index * 0.08,
                                ease: "easeOut"
                            }}
                        >
                            <h3 className='text-base font-semibold text-gray-900 md:mb-5 mb-2'>
                                {section.title}
                            </h3>

                            <ul className='text-sm space-y-1'>
                                {section.links.map((link, index) => (
                                    <li key={index}>
                                        <motion.a
                                            href="#"
                                            whileHover={{ x: 3 }}
                                            className='hover:underline hover:text-primary transition-all duration-300'
                                        >
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

            </div>


            <motion.p
                className='py-4 text-center text-sm md:text-base text-gray-500/80'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.4,
                    delay: 0.2
                }}
            >
                Copyright 2026 © QuickBlog GreatStack - All Right Reserved.
            </motion.p>

        </motion.div>
    )
}

export default Footer