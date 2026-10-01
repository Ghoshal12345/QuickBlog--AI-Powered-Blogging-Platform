import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, blogCategories } from '../../assets/assets.js';
import Quill from 'quill';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { EditBlogSkeleton } from '../../components/ui/skeletons.jsx';
import { motion, AnimatePresence } from 'motion/react';

function Edit_blog() {

    const { id } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState("Startup");
    const [isPublished, setIsPublished] = useState(false);
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initialize Quill editor when the component mounts and when the description is loaded
    useEffect(() => {
        if (!loading && !quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Write your blog content here...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['blockquote', 'link'],
                        ['clean']
                    ]
                }
            });
            quillRef.current.clipboard.dangerouslyPasteHTML(
                description || ""
            );
        }
    }, [loading, description]);


    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/api/blog/id/${id}`);
                const blog = data.blog;

                setTitle(blog.title || "");
                setSubTitle(blog.subTitle || "");
                setCategory(blog.category || "Startup");
                setIsPublished(blog.isPublished);
                setExistingImage(blog.image || "");
                setDescription(blog.description || "");

                // if (quillRef.current) {
                //     quillRef.current.clipboard.dangerouslyPasteHTML(
                //         blog.description || ""
                //     );
                //     // quillRef.current.root.innerHTML = data.content;
                // }
            } catch (error) {
                console.error("Error fetching blog:", error);
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load blog"
                );
                navigate("/user/my-blogs", { replace: true });
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, navigate]);


    // Function to generate content using AI
    const generateContent = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title to generate content");
            return;
        }
        try {
            setIsGenerating(true);
            const { data } = await api.post(
                '/api/blog/generate-content',
                { prompt: title }
            );
            if (quillRef.current) {
                quillRef.current.root.innerHTML = data.content;
            }
        } catch (error) {
            console.error("Error generating content:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to generate content"
            );
        } finally {
            setIsGenerating(false);
        }
    };


    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const description = quillRef.current?.root.innerHTML;
        if (!description || description === "<p><br></p>") {
            toast.error("Please write some blog content");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("subTitle", subTitle);
        formData.append("category", category);
        formData.append("isPublished", isPublished);
        formData.append("description", description);

        // Only send image if user selected a new one
        if (image) {
            formData.append("image", image);
        }

        try {
            setIsUpdating(true);
            await api.patch(`/api/blog/id/${id}`, formData);
            toast.success("Blog updated successfully");
            navigate("/blog/" + id, { replace: true });
        } catch (error) {

            console.error("Error updating blog:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update blog"
            );
        } finally {
            setIsUpdating(false);
        }
    };


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
            className="bg-gray-50 min-h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                <motion.div
                    variants={itemVariants}
                    className="mb-8"
                >

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Edit Blog
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Update your blog and keep your content fresh
                    </p>

                </motion.div>


                {loading ? (

                    <EditBlogSkeleton />

                ) : (

                    <form onSubmit={onSubmitHandler}>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{
                                y: -2,
                                transition: {
                                    duration: 0.2
                                }
                            }}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8"
                        >


                            {/* Thumbnail */}
                            <motion.div variants={itemVariants}>

                                <label className="text-sm font-medium text-gray-700">
                                    Blog Thumbnail
                                </label>

                                <p className="text-xs text-gray-400 mt-1">
                                    Choose a new image or keep the existing one
                                </p>


                                <label
                                    htmlFor="image"
                                    className="block mt-3 cursor-pointer"
                                >

                                    <motion.div
                                        whileHover={{
                                            scale: 1.01
                                        }}
                                        transition={{
                                            duration: 0.2
                                        }}
                                        className="w-full max-w-md h-48 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 overflow-hidden bg-gray-50 transition"
                                    >

                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : existingImage || assets.upload_area
                                            }
                                            alt="Blog thumbnail"
                                            className="w-full h-full object-cover transition-transform duration-500"
                                        />

                                    </motion.div>

                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            setImage(e.target.files[0])
                                        }
                                    />

                                </label>

                            </motion.div>


                            {/* Title */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-7"
                            >

                                <label className="text-sm font-medium text-gray-700">
                                    Blog Title
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="Enter your blog title..."
                                    className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                                />

                            </motion.div>


                            {/* Subtitle */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-5"
                            >

                                <label className="text-sm font-medium text-gray-700">
                                    Blog Subtitle
                                </label>

                                <input
                                    type="text"
                                    value={subTitle}
                                    onChange={(e) =>
                                        setSubTitle(e.target.value)
                                    }
                                    placeholder="Give your readers a short introduction..."
                                    className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                                />

                            </motion.div>


                            {/* Content */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-7"
                            >

                                <div className="mb-2">

                                    <label className="text-sm font-medium text-gray-700">
                                        Blog Content
                                    </label>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Update your article or regenerate it with AI
                                    </p>

                                </div>


                                <div className="relative border border-gray-200 rounded-xl overflow-hidden">

                                    <div
                                        ref={editorRef}
                                        className="min-h-75"
                                    />


                                    <AnimatePresence>
                                        {isGenerating && (

                                            <motion.div
                                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                                                initial={{
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    opacity: 1
                                                }}
                                                exit={{
                                                    opacity: 0
                                                }}
                                                transition={{
                                                    duration: 0.2
                                                }}
                                            >

                                                <motion.div
                                                    className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-primary"
                                                    animate={{
                                                        rotate: 360
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                    }}
                                                />

                                                <motion.p
                                                    className="text-sm text-gray-500 mt-3"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 5
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    transition={{
                                                        delay: 0.1,
                                                        duration: 0.25
                                                    }}
                                                >
                                                    AI is writing your blog...
                                                </motion.p>

                                            </motion.div>

                                        )}
                                    </AnimatePresence>

                                </div>


                                <div className="flex justify-end mt-3">

                                    <motion.button
                                        type="button"
                                        onClick={generateContent}
                                        disabled={isGenerating}
                                        whileHover={
                                            !isGenerating
                                                ? { scale: 1.03 }
                                                : {}
                                        }
                                        whileTap={
                                            !isGenerating
                                                ? { scale: 0.97 }
                                                : {}
                                        }
                                        className="text-sm font-medium text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition disabled:opacity-50"
                                    >
                                        {isGenerating
                                            ? "Generating..."
                                            : "Generate with AI"}
                                    </motion.button>

                                </div>

                            </motion.div>


                            {/* Category + Publishing */}
                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7"
                            >

                                <div>

                                    <label className="text-sm font-medium text-gray-700">
                                        Category
                                    </label>

                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition duration-200"
                                    >
                                        {blogCategories.filter((item) => item !== "All").map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div>

                                    <label className="text-sm font-medium text-gray-700">
                                        Publishing
                                    </label>

                                    <label className="flex items-center justify-between mt-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer transition duration-200 hover:border-primary/20">

                                        <div>

                                            <p className="text-sm font-medium text-gray-700">
                                                Publish immediately
                                            </p>

                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Make this blog visible to everyone
                                            </p>

                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={isPublished}
                                            onChange={(e) =>
                                                setIsPublished(e.target.checked)
                                            }
                                            className="w-4 h-4 cursor-pointer"
                                        />

                                    </label>

                                </div>

                            </motion.div>


                            {/* Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100"
                            >

                                <motion.button
                                    type="button"
                                    onClick={() => navigate("/user/my-blogs")}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </motion.button>


                                <motion.button
                                    type="submit"
                                    disabled={isUpdating}
                                    whileHover={!isUpdating ? { scale: 1.03 } : {}}
                                    whileTap={!isUpdating ? { scale: 0.97 } : {}}
                                    className="px-7 py-3 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </motion.button>

                            </motion.div>

                        </motion.div>

                    </form>

                )}

            </div>

        </motion.div>
    );
}

export default Edit_blog;