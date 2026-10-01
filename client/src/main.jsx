import { createRoot } from 'react-dom/client';
import './index.css';
import NotFound from './pages/notFound.jsx';
import BlogNotFound from './pages/blogNotFound.jsx';

import MainLayout from './layout/mainLayout.jsx';
import AdminLayout from './layout/adminLayout.jsx';
import UserLayout from './layout/userLayout.jsx';

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Home from './pages/home.jsx';
import Blog from './pages/blog.jsx';

import Login from './pages/auth/login.jsx';
import SignUp from './pages/auth/singnup.jsx';
import ForgotPassword from "./pages/auth/forgot_password.jsx";

import Profile from './pages/user/profile.jsx';
import EditProfile from './pages/user/edit_profile.jsx';
import MyBlogs from './pages/user/myBlogs.jsx';
import Add_blog from './pages/user/add_blog.jsx';
import Edit_blog from './pages/user/edit_blog.jsx';

import Dashboard from './pages/admin/dashboard.jsx';
import List_blog from './pages/admin/list_blog.jsx';
import Comments from './pages/admin/comments.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import ProtectedAdmin from './routes/ProtectedAdmin.jsx';

import 'quill/dist/quill.snow.css';

import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import AuthInitializer from "./components/AuthInitializer.jsx";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { motion } from 'motion/react';

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    children: [

      // PUBLIC ROUTES
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: "blog/:id",
            element: <Blog />
          },
          {
            path: "blog-not-found",
            element: <BlogNotFound />
          }
        ]
      },


      // AUTH ROUTES
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/signup",
        element: <SignUp />
      },


      // AUTHENTICATED USER ROUTES
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/user",
            element: <UserLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="profile" replace /> //relative path to profile
              },

              {
                path: "profile",
                element: <Profile />
              },

              {
                path: "edit-profile",
                element: <EditProfile />
              },

              {
                path: "my-blogs",
                element: <MyBlogs />
              },

              {
                path: "add-blog",
                element: <Add_blog />
              },

              {
                path: "edit-blog/:id",
                element: <Edit_blog />
              }

            ]
          }
        ]
      },


      // ADMIN ROUTES
      {
        element: <ProtectedAdmin />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [

              {
                index: true,
                element: <Dashboard />
              },

              {
                path: "blogs",
                element: <List_blog />
              },

              {
                path: "comments",
                element: <Comments />
              }

            ]
          }
        ]
      }

    ]
  }
]);


createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthInitializer>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <RouterProvider router={routes} />
          </motion.div>

          <Toaster
            position="top-center"
            reverseOrder={false}
          />

        </AuthInitializer>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </Provider>

);


//  <Navigate to="/user/profile" replace /> absolute path to profile start from root to that path