import React, { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { isSearchBarOpen } = useSelector((state) => state.popup);

  useEffect(() => {
    if (isSearchBarOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          dispatch(toggleSearchBar());
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSearchBarOpen, dispatch]);

  if (!isSearchBarOpen) return null;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim() !== "") {
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => dispatch(toggleSearchBar())}
      />
      <div className="relative z-10 w-full max-w-2xl animate-slide-in-top">
        <div className="bg-white/40 dark:bg-black/35 backdrop-blur-2xl p-6 shadow-2xl shadow-black/5 rounded-[32px] md:rounded-[36px] border border-white/50 dark:border-white/10">
          
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/5 dark:border-white/10">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-white dark:text-white px-1">
              Search Products
            </h2>
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-[#8c6772] hover:text-[#4a2430] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition active:scale-90"
              aria-label="Close Search"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-white dark:text-white" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, essentials..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl text-sm md:text-base text-[#4a2430] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/50 transition backdrop-blur-md"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#9c5b6f]/90 hover:bg-[#854b5d] text-white text-xs md:text-sm font-semibold rounded-xl shadow-md shadow-[#9c5b6f]/20 transition active:scale-95 backdrop-blur-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;