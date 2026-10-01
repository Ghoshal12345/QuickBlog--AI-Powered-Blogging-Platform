import axios from "axios";
import { store } from "../redux/store.js";
import { logoutSuccess } from "../redux/authSlice.js";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

let sessionRedirecting = false;

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (
            status === 401 &&
            code === "SESSION_REPLACED" &&
            window.location.pathname !== "/login" &&
            !sessionRedirecting
        ) {
            sessionRedirecting = true;

            toast.error(
                "You have been logged out because your account was signed in on another device.",
                {
                    duration: 9000,
                }
            );

            setTimeout(() => {
                store.dispatch(logoutSuccess());
                window.location.href = "/login";
            }, 1500);

            // Prevent the individual page's catch block
            // from showing another toast.
            return new Promise(() => {});
        }
        return Promise.reject(error);
    }
);

export default api;

// axios is configured to use the base URL from environment variables and to include credentials (like cookies) in requests. This setup is useful for making API calls to a backend server while maintaining session information.