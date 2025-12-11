import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    const location = useLocation();

    // Hide navbar/footer on login/register pages if desired, or keep them. 
    // Prompt says "Navbar and Footer visible on most pages (excluding the dashboard layout)".
    // So for main layout they should be visible.

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('register');

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-lime-400 selection:text-black">
            {/* simple conditional if we wanted to hide on auth pages, but prompt implies Main Layout has them. 
                "Login / Register" is in the "Page List" which usually uses Main Layout.
                I'll leave them visible or optional based on standard UI. Prompt says "Not Logged In: Login Button..." in Navbar, so Navbar is likely present on Auth pages too unless specific design request.
                But usually Login pages are clean. Let's keep Navbar for navigation.
            */}
            <Navbar></Navbar>
            <div className="min-h-[calc(100vh-200px)] pt-20">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;
