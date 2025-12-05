import { Outlet } from 'react-router';
import Footer from '../Components/Shared/Footer/Footer';
import Navbar from '../Components/Shared/Navbar/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header>
                <Navbar></Navbar>
            </header>
            <div className="flex-1">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;