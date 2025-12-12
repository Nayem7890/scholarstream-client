import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSearch, FaTimes, FaFilter, FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AllScholarships = () => {
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const limit = 6;

    const searchRef = useRef(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search input
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch all scholarships for suggestions
    const { data: suggestionsData } = useQuery({
        queryKey: ["suggestions", searchInput],
        queryFn: async () => {
            if (!searchInput || searchInput.length < 2) return { data: [] };

            const params = new URLSearchParams({
                search: searchInput,
                limit: "10",
            });

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/scholarships?${params.toString()}`
            );
            return res.data;
        },
        enabled: searchInput.length >= 2,
    });

    // Fetch scholarships with search, filter
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
            return res.data;
        },
    });

    const scholarships = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;
    const suggestions = suggestionsData?.data || [];

    // Extract unique values
    const uniqueUniversities = [...new Set(suggestions.map(s => s.universityName))].slice(0, 3);
    const uniqueCountries = [...new Set(suggestions.map(s => s.universityCountry))].slice(0, 3);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
    };

    const handleCategoryChange = (value) => {
        setCategory(value === "all" ? "" : value);
        setPage(1);
    };

    const handleSuggestionClick = (value) => {
        setSearchInput(value);
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setShowSuggestions(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    if (isLoading && !searchInput) {
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
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-center mb-4 text-white"
            >
                Find Your Opportunity<span className="text-[#a3e635]">.</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
            >
                Search through thousands of scholarships from top universities worldwide
            </motion.p>

            {/* Enhanced Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
            >
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                    {/* Search Bar with Suggestions */}
                    <div className="relative mb-6" ref={searchRef}>
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative flex items-center">
                                <FaSearch className="absolute left-5 text-gray-400 text-lg z-10" />
                                <input
                                    type="text"
                                    placeholder="Search by university, country, degree, or scholarship name..."
                                    className="input input-lg w-full bg-black border-white/20 text-white focus:border-[#a3e635] pl-14 pr-24 rounded-2xl transition-all"
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        setShowSuggestions(e.target.value.length >= 2);
                                    }}
                                    onFocus={() => searchInput.length >= 2 && setShowSuggestions(true)}
                                />

                                {/* Loading*/}
                                {isSearching && (
                                    <div className="absolute right-20">
                                        <span className="loading loading-spinner loading-sm text-[#a3e635]"></span>
                                    </div>
                                )}

                                {/* Clear Button */}
                                {searchInput && !isSearching && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-20 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FaTimes className="text-lg" />
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="absolute right-2 btn btn-md bg-[#a3e635] text-black hover:bg-lime-400 border-none rounded-xl px-6"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    {/* Universities */}
                                    {uniqueUniversities.length > 0 && (
                                        <div className="p-4 border-b border-white/10">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <FaGraduationCap /> Universities
                                            </p>
                                            {uniqueUniversities.map((uni, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(uni)}
                                                    className="w-full text-left px-3 py-2 hover:bg-[#a3e635]/10 rounded-lg transition-colors text-white text-sm"
                                                >
                                                    {uni}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Countries */}
                                    {uniqueCountries.length > 0 && (
                                        <div className="p-4 border-b border-white/10">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <FaMapMarkerAlt /> Countries
                                            </p>
                                            {uniqueCountries.map((country, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(country)}
                                                    className="w-full text-left px-3 py-2 hover:bg-[#a3e635]/10 rounded-lg transition-colors text-white text-sm"
                                                >
                                                    {country}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Top Scholarships */}
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                            Top Results
                                        </p>
                                        {suggestions.slice(0, 3).map((scholarship, index) => (
                                            <Link
                                                key={index}
                                                to={`/scholarship/${scholarship._id}`}
                                                onClick={() => setShowSuggestions(false)}
                                                className="block px-3 py-3 hover:bg-[#a3e635]/10 rounded-lg transition-colors group"
                                            >
                                                <p className="text-white text-sm font-medium group-hover:text-[#a3e635] transition-colors">
                                                    {scholarship.scholarshipName}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {scholarship.universityName} • {scholarship.universityCountry}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                            <FaFilter className="text-sm" />
                            <span className="text-sm font-medium">Filter by:</span>
                        </div>
                        {["all", "Full fund", "Partial fund", "Self fund"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(cat === "all" && !category) || category === cat
                                        ? "bg-[#a3e635] text-black shadow-lg shadow-[#a3e635]/20"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                    }`}
                            >
                                {cat === "all" ? "All Categories" : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Results Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 text-gray-400 text-center"
            >
                <span className="text-lg">
                    Showing <span className="text-white font-semibold">{scholarships.length}</span> of{" "}
                    <span className="text-white font-semibold">{total}</span> scholarships
                </span>
                {debouncedSearch && (
                    <span className="ml-2">
                        for "<span className="text-[#a3e635] font-semibold">{debouncedSearch}</span>"
                    </span>
                )}
                {category && (
                    <span className="ml-2">
                        in <span className="text-[#a3e635] font-semibold">{category}</span>
                    </span>
                )}
            </motion.div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-[#a3e635]"></span>
                </div>
            ) : scholarships.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {scholarships.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card bg-gradient-to-br from-[#111] to-[#0a0a0a] shadow-xl border border-white/10 rounded-3xl overflow-hidden group hover:border-[#a3e635]/50 transition-all duration-300"
                        >
                            <figure className="relative h-64 w-full overflow-hidden">
                                <img
                                    src={item.universityImage}
                                    alt={item.universityName}
                                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-[#a3e635] text-xs font-bold border border-[#a3e635]/30">
                                    {item.scholarshipCategory}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-xl font-bold text-white mb-1">
                                        {item.universityName}
                                    </h2>
                                </div>
                            </figure>
                            <div className="card-body">
                                <p className="font-medium text-gray-300 line-clamp-2 mb-4">
                                    {item.scholarshipName}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                                    <p className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-[#a3e635]" />
                                        {item.universityCity}, {item.universityCountry}
                                    </p>
                                    <p className="font-semibold">
                                        <span className="text-[#a3e635]">${item.applicationFees}</span>
                                    </p>
                                </div>
                                <div className="card-actions">
                                    <Link
                                        to={`/scholarship/${item._id || index}`}
                                        className="btn bg-[#a3e635] text-black hover:bg-lime-400 border-none w-full rounded-full shadow-lg shadow-[#a3e635]/20 hover:shadow-xl hover:shadow-[#a3e635]/30 transition-all"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-400 text-xl mb-2">No scholarships found</p>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                    {(debouncedSearch || category) && (
                        <button
                            onClick={() => {
                                clearSearch();
                                setCategory("");
                            }}
                            className="btn btn-outline border-white/20 text-white hover:bg-[#a3e635] hover:text-black mt-6 rounded-full"
                        >
                            Clear All Filters
                        </button>
                    )}
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center gap-2 mt-16"
                >
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="btn btn-sm bg-[#111] text-white border-white/10 hover:bg-[#a3e635] hover:text-black hover:border-[#a3e635] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                        « Prev
                    </button>

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
                                    className={`join-item btn btn-sm transition-all ${page === pageNum
                                            ? "bg-[#a3e635] text-black border-none hover:bg-lime-400 shadow-lg shadow-[#a3e635]/20"
                                            : "bg-[#111] text-white border-white/10 hover:bg-[#222]"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="btn btn-sm bg-[#111] text-white border-white/10 hover:bg-[#a3e635] hover:text-black hover:border-[#a3e635] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                        Next »
                    </button>
                </motion.div>
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
