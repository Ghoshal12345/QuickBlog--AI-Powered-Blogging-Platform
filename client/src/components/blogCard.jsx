import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react';

function BlogCard({ blog }) {

    const { _id, title, description, image, category } = blog;

    return (
        <Link to={`/blog/${_id}`}>

            <motion.div
                className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer'
                whileHover={{
                    y: -5
                }}
                whileTap={{
                    scale: 0.98
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut"
                }}
            >

                <motion.img
                    src={image}
                    alt={title}
                    className='aspect-video'
                    whileHover={{
                        scale: 1.03
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut"
                    }}
                />

                <span className='ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs '>
                    {category}
                </span>

                <div className='p-5'>

                    <h5 className='mb-2 font-medium text-gray-900 '>
                        {title}
                    </h5>

                    <p
                        className='mb-3 text-xs text-gray-600 '
                        dangerouslySetInnerHTML={{
                            "__html": description.slice(0, 80)
                        }}
                    >
                    </p>

                </div>

            </motion.div>

        </Link>
    )
}

export default BlogCard;







// OR

// import React from 'react'
// import { Link } from 'react-router-dom'
// import { motion } from 'motion/react';

// function BlogCard({ blog }) {

//     const { _id, title, description, image, category } = blog;

//     return (
//         <Link to={`/blog/${_id}`}>

//             <motion.div
//                 className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer'
//                 whileHover={{
//                     y: -5,
//                     scale: 1.02
//                 }}
//                 whileTap={{
//                     scale: 0.98
//                 }}
//                 transition={{
//                     duration: 0.25,
//                     ease: "easeOut"
//                 }}
//             >

//                 <motion.img
//                     src={image}
//                     alt={title}
//                     className='aspect-video'
//                     whileHover={{
//                         scale: 1.03
//                     }}
//                     transition={{
//                         duration: 0.3,
//                         ease: "easeOut"
//                     }}
//                 />

//                 <motion.span
//                     className='ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs'
//                     whileHover={{
//                         scale: 1.05
//                     }}
//                     transition={{
//                         duration: 0.2
//                     }}
//                 >
//                     {category}
//                 </motion.span>

//                 <div className='p-5'>

//                     <h5 className='mb-2 font-medium text-gray-900'>
//                         {title}
//                     </h5>

//                     <p
//                         className='mb-3 text-xs text-gray-600'
//                         dangerouslySetInnerHTML={{
//                             "__html": description.slice(0, 80)
//                         }}
//                     >
//                     </p>

//                 </div>

//             </motion.div>

//         </Link>
//     )
// }

// export default BlogCard;