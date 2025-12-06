import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import LoadingSpinner from "../Components/Shared/LoadingSpinner";
import About from "../Pages/About/About";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import MyLessons from "../Pages/My_Lessons/MyLessons";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../Pages/Error/ErrorPage";
import UserProfile from "../Components/Dashboard/User/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        hydrateFallbackElement: <LoadingSpinner></LoadingSpinner>,

        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "/about",
                Component: About,
            },
            {
                path: '/auth/login',
                Component: Login,
            },
            {
                path: '/auth/signup',
                Component: Signup,
            },
            {
                path:'/UserProfile'
                ,element:<PrivateRoute><UserProfile></UserProfile></PrivateRoute>
            },
            {
                path: '/my-lessons',
                element: <PrivateRoute><MyLessons></MyLessons></PrivateRoute>,
            }
        ],

    },
    {
        path: "*",
        Component: ErrorPage,
    }
]);

export default router;