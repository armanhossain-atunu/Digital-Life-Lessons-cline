import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import LoadingSpinner from "../Components/Shared/LoadingSpinner";
import About from "../Pages/About/About";

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
                path: "about",
                Component: About,
            }
        ],
    },
]);

export default router;