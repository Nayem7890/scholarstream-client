import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Swal from 'sweetalert2';
import { FaGoogle } from "react-icons/fa";

const Register = () => {
    const { createUser, googleSignIn, updateUserProfile } = useContext(AuthContext);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        // POST user to backend (name, email, role: 'student')
                        /*
                    
                        axios.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) { ... }
                            })
                        */
                        reset();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'User created successfully.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate('/');
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => {
                Swal.fire({ icon: 'error', title: 'Error', text: error.message });
            })
    };

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                navigate('/');
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="hero min-h-screen bg-black text-white">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl justify-between">
                <div className="text-center lg:text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold leading-tight">Join ScholarStream<span className="text-[#a3e635]">.</span></h1>
                    <p className="py-6 text-gray-400 text-lg">Create an account to start applying for scholarships and secure your future.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-[#111] border border-white/5 rounded-[2rem]">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Name</span>
                            </label>
                            <input type="text" {...register("name", { required: true })} placeholder="Name" className="input input-bordered bg-black border-white/10 text-white focus:border-[#a3e635] rounded-xl" />
                            {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Photo URL</span>
                            </label>
                            <input type="text" {...register("photoURL", { required: true })} placeholder="Photo URL" className="input input-bordered bg-black border-white/10 text-white focus:border-[#a3e635] rounded-xl" />
                            {errors.photoURL && <span className="text-red-500 text-sm mt-1">Photo URL is required</span>}
                        </div>
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
                            <input type="password" {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 20,
                                pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                            })} placeholder="password" className="input input-bordered bg-black border-white/10 text-white focus:border-[#a3e635] rounded-xl" />
                            {errors.password?.type === 'required' && <p className="text-red-500 text-sm mt-1">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-500 text-sm mt-1">Password must be 6 characters</p>}
                            {errors.password?.type === 'pattern' && <p className="text-red-500 text-sm mt-1">Password must have one uppercase, one lowercase, one number and one special character.</p>}
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-full normal-case text-lg" type="submit" value="Sign Up" />
                        </div>
                    </form>
                    <div className="divider before:bg-white/10 after:bg-white/10 text-gray-500">OR</div>
                    <div className="text-center pb-8 px-8">
                        <button onClick={handleGoogleSignIn} className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-black w-full rounded-full normal-case">
                            <FaGoogle className="mr-2"></FaGoogle> Continue with Google
                        </button>
                    </div>
                    <p className="text-center mb-6 text-sm text-gray-400">Already have an account? <Link to="/login" className="text-[#a3e635] hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
