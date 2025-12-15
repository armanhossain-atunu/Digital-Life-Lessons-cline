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
import AddLesson from "../Pages/Add_Lesson/AddLesson";
import DashboardLayout from "../Layouts/DashboardLayout";
import AdminProfile from "../Components/Dashboard/Admin/AdminProfile";
import DashboardHome from "../Components/Dashboard/DashboardHome/DashboardHome";
import LessonDetails from "../Components/Home/Lessons/LessonDetails";
import FavoriteLessons from "../Pages/Favorite_Lessons/FavoriteLessons";
import PaymentSuccess from "../Pages/Payment/paymentSuccess";
import ReportLesson from "../Pages/Reports/ReportLesson";
import Reports from "../Pages/Reports/Reports";
import ReviewSection from "../Components/Reviews/ReviewSection";
import LessonsUpdate from "../Components/Home/Lessons/LessonsUpdate";
import PaymentCancel from "../Pages/Payment/PaymentCancel";
import PublicLessons from "../Pages/Public_Lessons/PublicLessons";


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
                path: '/UserProfile'
                , element: <PrivateRoute><UserProfile></UserProfile></PrivateRoute>
            },
            {
                path: '/add-lessons',
                element: <PrivateRoute><AddLesson></AddLesson></PrivateRoute>,
            },
            {
                path: '/public-lessons',
                element: <PrivateRoute><PublicLessons></PublicLessons> </PrivateRoute>
            },
            {
                path: '/lesson-details/:id',
                element: <PrivateRoute><LessonDetails></LessonDetails></PrivateRoute>,
            },
            {
                path: '/my-lessons',
                element: <PrivateRoute><MyLessons></MyLessons></PrivateRoute>,
            },
            {
                path: '/favorite-lessons',
                element: <PrivateRoute><FavoriteLessons></FavoriteLessons></PrivateRoute>,
            },

            { path: '/Reviews', element: <PrivateRoute> <ReviewSection></ReviewSection> </PrivateRoute> },
            { path: '/lessonsUpdate/:id', element: <PrivateRoute> <LessonsUpdate></LessonsUpdate></PrivateRoute> },


        ],

    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            { index: true, element: <DashboardHome></DashboardHome> },
            { path: 'admin-profile', element: <AdminProfile></AdminProfile> },
            { path: 'add-lessons', element: <AddLesson></AddLesson> },
            { path: 'my-lessons', element: <MyLessons></MyLessons> },
            { path: 'Reports', element: <Reports></Reports> },
            { path: 'payment-success', element: <PaymentSuccess></PaymentSuccess> },
            { path: 'payment-cancel', element: <PaymentCancel></PaymentCancel> },

        ]

    },
    {
        path: "*",
        Component: ErrorPage,
    }
]);

export default router;