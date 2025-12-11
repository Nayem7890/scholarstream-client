import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AllScholarships = () => {


    const { data: scholarships = [], isLoading, isError, error } = useQuery({
        queryKey: ['scholarships'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/scholarships`);
            return res.data.data; // Backend returns { data, total, page, totalPages }
        }
    });

    const [search, setSearch] = useState("");

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center bg-black text-[#a3e635]"> <span className="loading loading-spinner loading-lg"></span> </div>
    }

    if (isError) {
        return <div className="min-h-screen flex justify-center items-center bg-black text-red-500">Error: {error.message}</div>
    }

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic or refetch with query param
    }

    return (
        <div className="max-w-screen-xl mx-auto my-20 px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Find Your Opportunity<span className="text-[#a3e635]">.</span></h2>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between mb-12 gap-4 bg-[#111] p-6 rounded-[2rem] border border-white/5">
                <form onSubmit={handleSearch} className="join w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by University, Degree..."
                        className="input input-bordered join-item bg-black border-white/10 text-white focus:border-[#a3e635] w-full md:w-80"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn bg-[#a3e635] text-black hover:bg-lime-400 join-item border-none">Search</button>
                </form>
                <select className="select select-bordered w-full md:max-w-xs bg-black border-white/10 text-white focus:border-[#a3e635]">
                    <option disabled selected>Filter by Category</option>
                    <option>Full Fund</option>
                    <option>Partial Fund</option>
                    <option>Self Fund</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scholarships.map((item, index) => (
                    <div key={item._id || index} className="card bg-[#111] shadow-xl border border-white/5 rounded-[2rem] overflow-hidden group hover:border-[#a3e635]/50 transition-colors">
                        <figure className="relative h-64 w-full">
                            <img src={item.universityImage} alt={item.universityName} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[#a3e635] text-xs font-bold border border-white/10">
                                {item.scholarshipCategory}
                            </div>
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-white">{item.universityName}</h2>
                            <p className="font-medium text-gray-400">{item.scholarshipName}</p>
                            <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4 text-sm text-gray-500">
                                <p>📍 {item.universityCity}, {item.universityCountry}</p>
                                <p>Fees: <span className="text-white">${item.applicationFees}</span></p>
                            </div>
                            <div className="card-actions justify-end mt-6">
                                <Link to={`/scholarship/${item._id || index}`} className="btn btn-outline border-white/20 text-white hover:bg-[#a3e635] hover:text-black w-full rounded-full">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="join flex justify-center mt-16">
                <button className="join-item btn bg-[#111] text-white border-white/10 hover:bg-[#222]">1</button>
                <button className="join-item btn bg-[#a3e635] text-black border-none hover:bg-lime-400">2</button>
                <button className="join-item btn bg-[#111] text-white border-white/10 hover:bg-[#222]">3</button>
                <button className="join-item btn bg-[#111] text-white border-white/10 hover:bg-[#222]">4</button>
            </div>
        </div>
    );
};

export default AllScholarships;
