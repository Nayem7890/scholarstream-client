import { motion } from "framer-motion";

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ transform: "translate(-50%, -50%)" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ transform: "translate(-50%, -50%)" }}
                />
            </div>

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        ScholarStream
                        <motion.span
                            className="text-[#a3e635]"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            .
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Spinner */}
                <div className="relative w-20 h-20 mb-6">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-transparent border-t-[#a3e635] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    {/* Inner Ring */}
                    <motion.div
                        className="absolute inset-2 border-4 border-transparent border-t-lime-400 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    {/* Center Dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-3 h-3 bg-[#a3e635] rounded-full shadow-lg shadow-[#a3e635]/50" />
                    </motion.div>
                </div>

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-lg"
                >
                    {message}
                </motion.p>

                {/* Animated Dots */}
                <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-[#a3e635] rounded-full"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
