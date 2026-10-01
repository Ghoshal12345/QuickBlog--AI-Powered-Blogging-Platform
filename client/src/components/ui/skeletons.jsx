import React from 'react';
import { motion } from 'motion/react';


// ---------------------------------------------
// Basic Skeleton
// ---------------------------------------------
function Skeleton({ className = "" }) {
    return (
        <motion.div
            className={`bg-gray-200 animate-pulse rounded ${className}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}


// ---------------------------------------------
// Admin Dashboard Skeleton
// ---------------------------------------------

function DashboardSkeleton() {
    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {[1, 2, 3].map((item) => (
                    <motion.div
                        key={item}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.35,
                            delay: item * 0.06,
                            ease: "easeOut"
                        }}
                    >
                        <div className="flex items-center justify-between">

                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-12" />
                            </div>

                            <Skeleton className="w-14 h-14 rounded-xl" />

                        </div>
                    </motion.div>
                ))}

            </div>


            {/* Recent Blogs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.2,
                    ease: "easeOut"
                }}
            >

                {/* Section heading */}
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-36" />
                    </div>
                </div>


                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4">
                                        <Skeleton className="h-3 w-5" />
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        <Skeleton className="h-3 w-24" />
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        <Skeleton className="h-3 w-16" />
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        <Skeleton className="h-3 w-16" />
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        <Skeleton className="h-3 w-16" />
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <motion.tr
                                        key={item}
                                        className="border-b border-gray-100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: item * 0.04
                                        }}
                                    >
                                        <td className="px-5 py-5">
                                            <Skeleton className="h-4 w-5" />
                                        </td>

                                        <td className="px-5 py-5">
                                            <Skeleton className="h-4 w-52" />
                                        </td>

                                        <td className="px-5 py-5">
                                            <Skeleton className="h-4 w-24" />
                                        </td>

                                        <td className="px-5 py-5">
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </td>

                                        <td className="px-5 py-5">
                                            <div className="flex gap-2">
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>

            </motion.div>

        </motion.div>
    );
}


// ---------------------------------------------
// Admin All Blogs Skeleton
// ---------------------------------------------

function AdminBlogsSkeleton() {
    return (
        <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-4">
                                <Skeleton className="h-3 w-5" />
                            </th>

                            <th className="px-5 py-4 text-left">
                                <Skeleton className="h-3 w-24" />
                            </th>

                            <th className="px-5 py-4 text-left">
                                <Skeleton className="h-3 w-16" />
                            </th>

                            <th className="px-5 py-4 text-left">
                                <Skeleton className="h-3 w-16" />
                            </th>

                            <th className="px-5 py-4 text-left">
                                <Skeleton className="h-3 w-16" />
                            </th>
                        </tr>
                    </thead>


                    <tbody>

                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <motion.tr
                                key={item}
                                className="border-b border-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: item * 0.04
                                }}
                            >

                                <td className="px-5 py-5">
                                    <Skeleton className="h-4 w-5" />
                                </td>

                                <td className="px-5 py-5">
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-3 w-24 mt-2" />
                                </td>

                                <td className="px-5 py-5 hidden sm:table-cell">
                                    <Skeleton className="h-4 w-24" />
                                </td>

                                <td className="px-5 py-5 hidden sm:table-cell">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </td>

                                <td className="px-5 py-5">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </td>

                            </motion.tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </motion.div>
    );
}


// ---------------------------------------------
// Admin Comments Skeleton
// ---------------------------------------------

function AdminCommentsSkeleton() {
    return (
        <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>

                            <th className="px-6 py-4 text-left">
                                <Skeleton className="h-3 w-32" />
                            </th>

                            <th className="px-6 py-4 text-left hidden md:table-cell">
                                <Skeleton className="h-3 w-16" />
                            </th>

                            <th className="px-6 py-4 text-left">
                                <Skeleton className="h-3 w-16" />
                            </th>

                        </tr>
                    </thead>


                    <tbody>

                        {[1, 2, 3, 4, 5].map((item) => (
                            <motion.tr
                                key={item}
                                className="border-b border-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: item * 0.05
                                }}
                            >

                                <td className="px-6 py-5">

                                    <div className="space-y-3 max-w-2xl">
                                        <Skeleton className="h-4 w-56" />
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-4 w-full max-w-xl" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>

                                </td>


                                <td className="px-6 py-5 hidden md:table-cell">
                                    <Skeleton className="h-4 w-24" />
                                </td>


                                <td className="px-6 py-5">

                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-16 rounded-full" />
                                    </div>

                                </td>

                            </motion.tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </motion.div>
    );
}


// ---------------------------------------------
// My Blogs Skeleton
// ---------------------------------------------

function MyBlogsSkeleton() {
    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            {[1, 2, 3].map((item) => (
                <motion.div
                    key={item}
                    className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: item * 0.08,
                        ease: "easeOut"
                    }}
                >

                    <div className="flex flex-col sm:flex-row gap-5">

                        {/* Image */}
                        <Skeleton className="w-full sm:w-44 h-32 shrink-0 rounded-xl" />


                        {/* Blog information */}
                        <div className="flex-1 min-w-0">

                            {/* Category + status */}
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>


                            {/* Title */}
                            <Skeleton className="h-5 w-3/4 mt-4" />
                            <Skeleton className="h-5 w-1/2 mt-2" />


                            {/* Subtitle */}
                            <Skeleton className="h-4 w-full max-w-xl mt-3" />
                            <Skeleton className="h-4 w-2/3 mt-2" />


                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <Skeleton className="h-9 w-16 rounded-full" />
                                <Skeleton className="h-9 w-24 rounded-full" />
                                <Skeleton className="h-9 w-20 rounded-full" />
                            </div>

                        </div>

                    </div>

                </motion.div>
            ))}

        </motion.div>
    );
}


// ---------------------------------------------
// Edit Blog Skeleton
// ---------------------------------------------

function EditBlogSkeleton() {
    return (
        <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            {/* Thumbnail */}
            <div>

                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-64 mt-2" />

                <Skeleton className="w-full max-w-md h-48 rounded-xl mt-3" />

            </div>


            {/* Title */}
            <div className="mt-7">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full mt-2 rounded-xl" />
            </div>


            {/* Subtitle */}
            <div className="mt-5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full mt-2 rounded-xl" />
            </div>


            {/* Content */}
            <div className="mt-7">

                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-64 mt-2" />

                <Skeleton className="w-full h-72 mt-3 rounded-xl" />

            </div>


            {/* Bottom controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>


            <div className="flex justify-end mt-7">
                <Skeleton className="h-11 w-32 rounded-full" />
            </div>

        </motion.div>
    );
}


// ---------------------------------------------
// Edit Profile Skeleton
// ---------------------------------------------

function EditProfileSkeleton() {
    return (
        <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>


            {/* Main card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">

                {/* Profile image */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    <Skeleton className="w-28 h-28 rounded-full shrink-0" />

                    <div className="w-full space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-64 max-w-full" />
                        <Skeleton className="h-10 w-28 rounded-full" />
                    </div>

                </div>


                {/* Form fields */}
                <div className="space-y-6 mt-8">

                    <div>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full mt-2 rounded-xl" />
                    </div>

                    <div>
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-12 w-full mt-2 rounded-xl" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Skeleton className="h-11 w-28 rounded-full" />
                        <Skeleton className="h-11 w-32 rounded-full" />
                    </div>

                </div>

            </div>

        </motion.div>
    );
}


// ---------------------------------------------
// Blog Card Skeleton
// ---------------------------------------------

function BlogCardSkeleton() {
    return (
        <motion.div
            className="w-full rounded-lg overflow-hidden bg-white shadow-sm animate-pulse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >

            {/* Image */}
            <div className="aspect-video bg-gray-200"></div>

            {/* Category */}
            <div className="ml-5 mt-4 h-5 w-20 bg-gray-200 rounded-full"></div>

            <div className="p-5">

                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-4/5 mb-3"></div>

                {/* Description */}
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>

            </div>

        </motion.div>
    );
}


// ---------------------------------------------
// Blog Skeleton
// ---------------------------------------------

function BlogSkeleton() {
    return (
        <motion.div
            className="min-h-screen bg-white pb-12 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >

            {/* Blog Header */}
            <header className="text-center mt-24 px-5">

                {/* Date */}
                <div className="h-6 w-36 mx-auto bg-gray-200 rounded-full mb-5"></div>

                {/* Title */}
                <div className="h-10 sm:h-14 max-w-3xl mx-auto bg-gray-200 rounded-lg"></div>
                <div className="h-10 sm:h-14 max-w-xl mx-auto bg-gray-200 rounded-lg mt-3"></div>

                {/* Subtitle */}
                <div className="h-5 max-w-2xl mx-auto bg-gray-200 rounded mt-7"></div>
                <div className="h-5 max-w-md mx-auto bg-gray-200 rounded mt-3"></div>

                {/* Author */}
                <div className="flex items-center justify-center gap-3 mt-8 mb-10">

                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                    <div className="space-y-2 text-left">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-2 w-14 bg-gray-200 rounded"></div>
                    </div>

                </div>
            </header>


            {/* Blog Image */}
            <main className="mx-5 max-w-4xl md:mx-auto mt-6">

                <div className="w-full aspect-video bg-gray-200 rounded-3xl mb-12"></div>


                {/* Blog Content */}
                <article className="max-w-3xl mx-auto">

                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-10/12 mb-8"></div>

                    <div className="h-7 bg-gray-200 rounded w-2/5 mb-5"></div>

                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-9/12"></div>

                </article>

            </main>

        </motion.div>
    );
}


export {
    Skeleton,
    DashboardSkeleton,
    AdminBlogsSkeleton,
    AdminCommentsSkeleton,
    MyBlogsSkeleton,
    EditBlogSkeleton,
    EditProfileSkeleton,
    BlogCardSkeleton,
    BlogSkeleton
};