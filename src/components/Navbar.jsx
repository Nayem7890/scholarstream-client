import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    const navOptions = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/all-scholarships">All Scholarships</NavLink></li>
        {
            user ? <>
                <li><NavLink to="/dashboard/profile">Dashboard</NavLink></li>
            </> : <>
                {/* <li><NavLink to="/login">Login</NavLink></li> */}
            </>
        }
    </>

    return (
        <div className="fixed z-10 w-full bg-black/30 backdrop-blur-md">
            <div className="navbar max-w-screen-xl mx-auto text-white">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black">
                            {navOptions}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">ScholarStream<span className="text-[#a3e635] text-2xl">.</span></Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-medium">
                        {navOptions}
                    </ul>
                </div>
                <div className="navbar-end">
                    {
                        user ? <>
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-[#a3e635]">
                                    <div className="w-10 rounded-full">
                                        <img src={user?.photoURL} alt="User" />
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#111] border border-white/10 rounded-box w-52 text-white">
                                    <li>
                                        <button className="btn btn-sm btn-ghost justify-start">{user?.displayName}</button>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/profile">Dashboard</Link>
                                    </li>
                                    <li><button onClick={handleLogOut} className="text-red-400">Logout</button></li>
                                </ul>
                            </div>
                        </> : <>
                            <Link to="/login" className="btn btn-ghost text-white hover:bg-white/10 mx-2">Login</Link>
                            <Link to="/register" className="btn bg-[#a3e635] text-black border-none hover:bg-lime-400 rounded-full px-6">Register</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
