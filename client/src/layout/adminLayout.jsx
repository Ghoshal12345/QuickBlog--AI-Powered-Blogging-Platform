import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/adminSidebar.jsx";
import AdminHeader from "../components/admin/adminHeader.jsx";
import { motion } from "motion/react";

function AdminLayout() {
    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <AdminHeader />

            <div className="flex h-[calc(100vh-70px)]">

                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.1,
                        ease: "easeOut"
                    }}
                >
                    <AdminSidebar />
                </motion.div>

                <motion.main
                    className="flex-1 min-w-0 overflow-y-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.45,
                        delay: 0.15,
                        ease: "easeOut"
                    }}
                >
                    <Outlet />
                </motion.main>

            </div>
        </motion.div>
    );
}

export default AdminLayout;