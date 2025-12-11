import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AllScholarships = () => {
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const limit = 6; // 6 cards per page

    // Debounced search for real-time search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce the search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to first page on search change
        }, 500); // 500ms delay for real-time search

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch scholarships with search, filter, and pagination
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["scholarships", debouncedSearch, category, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (debouncedSearch) params.append("search", debouncedSearch);
            if (category) params.append("category", category);

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/scholarships?${params.toString()}`
            );
            return res.data; // { data, total, page, totalPages }
        },
    });

    const scholarships = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        // Search happens automatically via debounce
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value === "all" ? "" : value);
        setPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(page - 1);
                pages.push(page);
                pages.push(page + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-[#a3e635]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-red-500">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto my-20 px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
                Find Your Opportunity<span className="text-[#a3e635]">.</span>
            </h2>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between mb-12 gap-4 bg-[#111] p-6 rounded-[2rem] border border-white/5">
                <form onSubmit={handleSearch} className="join w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by University, Degree..."
                        className="input input-bordered join-item bg-black border-white/10 text-white focus:border-[#a3e635] w-full md:w-80"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 join-item border-none"
                    >
                        Search
                    </button>
                </form>
                <select
                    className="select select-bordered w-full md:max-w-xs bg-black border-white/10 text-white focus:border-[#a3e635]"
                    value={category || "all"}
                    onChange={handleCategoryChange}
                >
                    <option value="all">All Categories</option>
                    <option value="Full fund">Full Fund</option>
                    <option value="Partial fund">Partial Fund</option>
                    <option value="Self fund">Self Fund</option>
                </select>
            </div>

            {/* Results Info */}
            <div className="mb-6 text-gray-400 text-center">
                Showing {scholarships.length} of {total} scholarships
                {debouncedSearch && (
                    <span className="ml-2">
                        for "<span className="text-[#a3e635]">{debouncedSearch}</span>"
                    </span>
                )}
                {category && (
                    <span className="ml-2">
                        in <span className="text-[#a3e635]">{category}</span>
                    </span>
                )}
            </div>

            {/* Grid */}
            {scholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {scholarships.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="card bg-[#111] shadow-xl border border-white/5 rounded-[2rem] overflow-hidden group hover:border-[#a3e635]/50 transition-colors"
                        >
                            <figure className="relative h-64 w-full">
                                <img
                                    src={item.universityImage}
                                    alt={item.universityName}
                                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[#a3e635] text-xs font-bold border border-white/10">
                                    {item.scholarshipCategory}
                                </div>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-2xl text-white">
                                    {item.universityName}
                                </h2>
                                <p className="font-medium text-gray-400">
                                    {item.scholarshipName}
                                </p>
                                <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4 text-sm text-gray-500">
                                    <p>
                                        📍 {item.universityCity}, {item.universityCountry}
                                    </p>
                                    <p>
                                        Fees: <span className="text-white">${item.applicationFees}</span>
                                    </p>
                                </div>
                                <div className="card-actions justify-end mt-6">
                                    <Link
                                        to={`/scholarship/${item._id || index}`}
                                        className="btn btn-outline border-white/20 text-white hover:bg-[#a3e635] hover:text-black w-full rounded-full"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-xl">No scholarships found</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="btn btn-sm bg-[#111] text-white border-white/10 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        « Prev
                    </button>

                    {/* Page Numbers */}
                    <div className="join">
                        {getPageNumbers().map((pageNum, index) => {
                            if (pageNum === "...") {
                                return (
                                    <button
                                        key={`ellipsis-${index}`}
                                        className="join-item btn btn-sm bg-[#111] text-white border-white/10 cursor-default"
                                        disabled
                                    >
                                        ...
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`join-item btn btn-sm ${page === pageNum
                                        ? "bg-[#a3e635] text-black border-none hover:bg-lime-400"
                                        : "bg-[#111] text-white border-white/10 hover:bg-[#222]"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="btn btn-sm bg-[#111] text-white border-white/10 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next »
                    </button>
                </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
                <div className="text-center mt-4 text-gray-500 text-sm">
                    Page {page} of {totalPages}
                </div>
            )}
        </div>
    );
};

export default AllScholarships;
