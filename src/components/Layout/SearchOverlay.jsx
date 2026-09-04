import React, { useState, useEffect, useRef } from "react";
import { X, Search, Loader2, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";
import { axiosInstance } from "../../lib/axios";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
    } else {
      setSearchQuery("");
      setSuggestions([]);
    }
  }, [isSearchBarOpen, dispatch]);
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/product/search?query=${encodeURIComponent(searchQuery.trim())}`);
        setSuggestions(res.data.products || []);
      } catch (error) {
        console.error("AI Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchBarOpen) return null;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim() !== "") {
      inputRef.current?.blur();
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSelectProduct = (productId) => {
    dispatch(toggleSearchBar());
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => dispatch(toggleSearchBar())}
      />
      <div className="relative z-10 w-full max-w-2xl animate-slide-in-top">
        <div className="bg-white/70 dark:bg-[#120b0e]/85 backdrop-blur-2xl p-6 shadow-2xl shadow-black/10 rounded-[32px] md:rounded-[36px] border border-white/50 dark:border-white/10 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-800 dark:text-white px-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9c5b6f]" /> AI Smart Search
            </h2>
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-[#8c6772] hover:text-[#4a2430] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition active:scale-90 cursor-pointer"
              aria-label="Close Search"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSearch}
            className="relative flex items-center"
          >
            <Search className="absolute left-4 w-5 h-5 text-[#8c6772] dark:text-[#b8959f]" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (e.g., kids toys, bhalo phone, shirt)..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl text-sm md:text-base text-[#4a2430] dark:text-[#f7eef1] placeholder-[#8c6772]/60 dark:placeholder-[#b8959f]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/50 transition backdrop-blur-md"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#9c5b6f]/90 hover:bg-[#854b5d] text-white text-xs md:text-sm font-semibold rounded-xl shadow-md shadow-[#9c5b6f]/20 transition active:scale-95 backdrop-blur-md cursor-pointer"
            >
              Search
            </button>
          </form>
          {searchQuery.trim() !== "" && (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 rounded-2xl bg-white/60 dark:bg-black/30 border border-white/40 dark:border-white/10 p-2">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-[#9c5b6f] font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI is finding best matches...</span>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching products found. Press Enter to view all results.
                </div>
              ) : (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    <img
                      src={item.image || item.images?.[0]?.url || "https://placehold.co/80x80?text=Product"}
                      alt={item.name || item.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.name || item.title}
                      </p>
                      <p className="text-[11px] text-[#9c5b6f] font-semibold mt-0.5">
                        ৳{Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SearchOverlay;