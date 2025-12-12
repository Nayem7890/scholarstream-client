import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Swal from 'sweetalert2';
import { FaGoogle } from "react-icons/fa";

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const onSubmit = data => {
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                Swal.fire({
                    title: 'User Login Successful.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
            })
    };

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                // POST user to backend
                navigate(from, { replace: true });
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="hero min-h-screen bg-black text-white">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl justify-between">
                <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold leading-tight">Welcome Back<span className="text-[#a3e635]">.</span></h1>
                    <p className="py-6 text-gray-400 text-lg">Access your dashboard to track applications and explore new scholarship opportunities.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-[#111] border border-white/5 rounded-[2rem]">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Email</span>
                            </label>
                            <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered bg-black border-white/10 text-white focus:border-[#a3e635] rounded-xl" />
                            {errors.email && <span className="text-red-500 text-sm mt-1">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Password</span>
                            </label>
                            <input type="password" {...register("password", { required: true })} placeholder="password" className="input input-bordered bg-black border-white/10 text-white focus:border-[#a3e635] rounded-xl" />
                            {errors.password && <span className="text-red-500 text-sm mt-1">Password is required</span>}
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full normal-case text-lg" type="submit" value="Login" />
                        </div>
                    </form>
                    <div className="divider before:bg-white/10 after:bg-white/10 text-gray-500">OR</div>
                    <div className="text-center pb-8 px-8">
                        <button onClick={handleGoogleSignIn} className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-black w-full rounded-full normal-case">
                            <FaGoogle className="mr-2"></FaGoogle> Continue with Google
                        </button>
                    </div>
                    <p className="text-center mb-6 text-sm text-gray-400">New here? <Link to="/register" className="text-[#a3e635] hover:underline">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
