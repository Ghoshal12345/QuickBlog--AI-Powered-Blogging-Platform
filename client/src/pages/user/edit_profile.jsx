import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from '../../redux/authSlice.js';
import { EditProfileSkeleton } from '../../components/ui/skeletons.jsx';
import { motion, AnimatePresence } from 'motion/react';

function EditProfile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const [name, setName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');

    const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

    // Existing ImageKit image
    const [existingImage, setExistingImage] = useState(null);

    // Newly selected image file
    const [newImage, setNewImage] = useState(null);

    // Preview of newly selected image
    const [imagePreview, setImagePreview] = useState(null);


    // fetch current user data and populate the form fields
    const fetchCurrentUser = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/api/user/me');
            const { name, email } = data;
            setName(name);
            setNewEmail(email);
            setOriginalEmail(email);
            setExistingImage(data.profileImage || null);
            // setIsLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load profile");
            console.error("Error fetching current user:", error);
            navigate('/user/profile');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);



    // Handle profile image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        // Optional size restriction
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }
        setNewImage(file);
        setImagePreview(URL.createObjectURL(file));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !newEmail.trim()) {
            toast.error("Name and email are required");
            return;
        }
        const normalizedEmail = newEmail.trim().toLowerCase();

        try {
            setIsUpdating(true);
            console.log("step 1");
            //update name and profile image
            const formData = new FormData();
            formData.append('name', name);
            // formData.append('email', normalizedEmail);
            if (newImage) {
                formData.append('profileImage', newImage);
            }
            console.log("step 2", formData);
            const { data } = await api.patch('/api/user/profile', formData);
            console.log("step 3", data);
            // update redux with latest name and profile image
            dispatch(loginSuccess(data.user));
            console.log("step 4", data.user);
            // if Email hasn't changed
            if (normalizedEmail === originalEmail) {
                toast.success("Profile updated successfully");
                navigate('/user/profile');
                return;
            }
            console.log("step 4.1", normalizedEmail, originalEmail);
            // Email has changed-> request otp
            await api.post('/api/user/request-email-change', { newEmail: normalizedEmail });
            toast.success("OTP sent to your new email.");
            console.log("step 4.2");
            setEmailOtp('');
            setShowEmailOtpModal(true);

            console.log("step 4.3");
            // toast.success("Profile updated successfully");
            // setIsUpdating(false);
            // navigate('/user/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            console.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setIsUpdating(false);
        }
    }

    const handleVerifyEmail = async () => {
        if (!emailOtp.trim()) {
            toast.error("Please enter the OTP sent to your new email.");
            return;
        }
        try {
            setIsVerifyingEmail(true);
            const normalizedEmail = newEmail.trim().toLowerCase();
            const { data } = await api.post('/api/user/verify-email-change', { newEmail: normalizedEmail, otp: emailOtp });
            console.log("step 5", data);
            dispatch(loginSuccess(data.user));
            console.log("step 5.1", data.user);
            setShowEmailOtpModal(false);
            setEmailOtp('');
            console.log("step 5.2");
            toast.success("Email changed successfully");
            console.log("step 5.3");
            navigate('/user/profile');
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Invalid or expired OTP"
            );

            console.error(
                error.response?.data?.message ||
                "Email verification failed"
            );
        } finally {
            setIsVerifyingEmail(false);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            setIsDeletingAccount(true);

            // Backend API — we will create this endpoint later
            await api.delete('/api/user/delete');

            toast.success("Account deleted permanently. We're sad to see you go!");

            // Remove user from Redux
            dispatch(logoutSuccess());

            // Go back to login page
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
            console.error(error.response?.data?.message || "Error deleting account");
        } finally {
            setIsDeletingAccount(false);
            setShowDeleteModal(false);
        }
    }

    if (isLoading) {
        return (<EditProfileSkeleton />);
    }


    const displayedImage = imagePreview || existingImage;


    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 12
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: "easeOut",
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 10
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };


    return (

        <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="mb-8"
            >

                <h1 className="text-2xl font-semibold text-gray-800">
                    Edit Profile
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Update your personal information and profile picture
                </p>

            </motion.div>


            {/* Profile image section */}
            <motion.div
                variants={itemVariants}
                whileHover={{
                    y: -2,
                    transition: {
                        duration: 0.2
                    }
                }}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8"
            >

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    {/* Image */}
                    <motion.div
                        className="relative group"
                        whileHover={{
                            scale: 1.02
                        }}
                        transition={{
                            duration: 0.2
                        }}
                    >

                        {displayedImage ? (

                            <motion.img
                                src={displayedImage}
                                alt="Profile"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25 }}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                            />

                        ) : (

                            <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg">

                                <span className="text-4xl font-semibold text-primary">
                                    {name?.charAt(0)?.toUpperCase() || "U"}
                                </span>

                            </div>

                        )}

                        {/* Edit image button */}
                        <motion.label
                            htmlFor="profileImage"
                            whileHover={{
                                scale: 1.08
                            }}
                            whileTap={{
                                scale: 0.92
                            }}
                            transition={{
                                duration: 0.15
                            }}
                            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition"
                            title="Change profile picture"
                        >
                            ✎
                        </motion.label>

                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </motion.div>


                    {/* Image information */}
                    <div className="text-center sm:text-left">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Profile Picture
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Choose a clear image for your profile.
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            JPG, PNG or WEBP · Maximum 5MB
                        </p>

                        <AnimatePresence mode="wait">
                            {newImage && (
                                <motion.p
                                    key="new-image"
                                    initial={{
                                        opacity: 0,
                                        y: 5
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -5
                                    }}
                                    transition={{
                                        duration: 0.2
                                    }}
                                    className="text-xs text-primary font-medium mt-2"
                                >
                                    New image selected
                                </motion.p>
                            )}
                        </AnimatePresence>

                    </div>

                </div>


                {/* Divider */}
                <div className="border-t border-gray-100 my-8" />


                {/* Personal information */}
                <motion.div variants={itemVariants}>

                    <h2 className="text-lg font-semibold text-gray-800">
                        Personal Information
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Keep your account information up to date.
                    </p>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Name */}
                        <div>

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition duration-200"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition duration-200"
                            />

                        </div>

                    </div>

                </motion.div>


                {/* Actions */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-100 mt-8 pt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3"
                >

                    <motion.button
                        type="button"
                        onClick={() => navigate('/user/profile')}
                        disabled={isUpdating}
                        whileHover={!isUpdating ? { scale: 1.03 } : {}}
                        whileTap={!isUpdating ? { scale: 0.97 } : {}}
                        className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </motion.button>


                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        whileHover={!isUpdating ? { scale: 1.03 } : {}}
                        whileTap={!isUpdating ? { scale: 0.97 } : {}}
                        className="px-7 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition shadow-lg shadow-primary/15 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isUpdating
                            ? "Saving Changes..."
                            : "Save Changes"
                        }
                    </motion.button>

                </motion.div>
            </motion.div>


            {/* ================= EMAIL OTP MODAL ================= */}
            <AnimatePresence>
                {showEmailOtpModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >

                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-gray-900/45 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                                if (!isVerifyingEmail) {
                                    setShowEmailOtpModal(false);
                                }
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7"
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

                            {/* Icon */}
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
                                className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl"
                            >
                                ✉
                            </motion.div>

                            {/* Heading */}
                            <div className="text-center mt-5">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Verify your new email
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 leading-6">
                                    We've sent a 6-digit OTP to
                                </p>

                                <p className="text-sm font-semibold text-gray-800 mt-1 break-all">
                                    {newEmail}
                                </p>

                            </div>


                            {/* OTP Input */}
                            <div className="mt-6">

                                <label
                                    htmlFor="emailOtp"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Enter OTP
                                </label>

                                <input
                                    id="emailOtp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={emailOtp}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6);

                                        setEmailOtp(value);
                                    }}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-center tracking-[0.4em] text-lg font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 transition duration-200"
                                />

                            </div>


                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">

                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setShowEmailOtpModal(false);
                                        setEmailOtp('');
                                    }}
                                    disabled={isVerifyingEmail}
                                    whileHover={!isVerifyingEmail ? { scale: 1.02 } : {}}
                                    whileTap={!isVerifyingEmail ? { scale: 0.97 } : {}}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={handleVerifyEmail}
                                    disabled={
                                        isVerifyingEmail ||
                                        emailOtp.length !== 6
                                    }
                                    whileHover={
                                        !isVerifyingEmail && emailOtp.length === 6
                                            ? { scale: 1.02 }
                                            : {}
                                    }
                                    whileTap={
                                        !isVerifyingEmail && emailOtp.length === 6
                                            ? { scale: 0.97 }
                                            : {}
                                    }
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition shadow-lg shadow-primary/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isVerifyingEmail
                                        ? "Verifying..."
                                        : "Verify Email"
                                    }
                                </motion.button>

                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* ================= DANGER ZONE ================= */}
            <motion.div
                variants={itemVariants}
                whileHover={{
                    y: -2,
                    transition: {
                        duration: 0.2
                    }
                }}
                className="mt-6 bg-white border border-red-200 rounded-2xl p-6 sm:p-8"
            >

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold">
                                !
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800">
                                Danger Zone
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500 mt-3 max-w-xl">
                            Permanently delete your QuickBlog account and all
                            associated data. This action cannot be undone.
                        </p>
                    </div>

                    <motion.button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="shrink-0 px-5 py-2.5 rounded-full border border-red-200 bg-red-50 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                        Delete Account
                    </motion.button>

                </div>

            </motion.div>


            {/* ================= DELETE ACCOUNT MODAL ================= */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >

                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-gray-900/45 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                                if (!isDeletingAccount) {
                                    setShowDeleteModal(false);
                                }
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7"
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

                            {/* Warning Icon */}
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
                                className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl font-bold"
                            >
                                !
                            </motion.div>

                            {/* Heading */}
                            <div className="text-center mt-5">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Delete your account?
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 leading-6">
                                    This action is permanent and cannot be undone.
                                    Your profile and account data will be deleted.
                                </p>

                            </div>

                            {/* Warning Box */}
                            <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-4">
                                <p className="text-sm text-red-600 leading-6">
                                    Once your account is deleted, you will no longer
                                    be able to access it.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">

                                <motion.button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeletingAccount}
                                    whileHover={!isDeletingAccount ? { scale: 1.02 } : {}}
                                    whileTap={!isDeletingAccount ? { scale: 0.97 } : {}}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeletingAccount}
                                    whileHover={!isDeletingAccount ? { scale: 1.02 } : {}}
                                    whileTap={!isDeletingAccount ? { scale: 0.97 } : {}}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 shadow-md shadow-red-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeletingAccount
                                        ? "Deleting..."
                                        : "Delete Account"
                                    }
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>

    );
}

export default EditProfile;