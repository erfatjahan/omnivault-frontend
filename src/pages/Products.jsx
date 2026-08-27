import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Sparkles,
  Star,
  SlidersHorizontal,
  RotateCcw,
  Layers,
  DollarSign,
  X,
  Check,
  PackageOpen,
  ArrowUpDown,
  Bot,
  CheckCircle2
} from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchAllProducts } from "../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux State
  const {
    products = [],
    totalProducts = 0,
    loading = false,
  } = useSelector((state) => state.product || {});

  // ফিল্টার ও সর্টিং স্টেট
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [ratings, setRatings] = useState("");
  const [availability, setAvailability] = useState(""); // "", "in-stock", "limited", "out-of-stock"
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // URL Query Params সিঙ্ক
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    const searchParam = queryParams.get("search");

    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
  }, [location.search]);

  // ফিল্টার রিকোয়েস্ট ডেসপ্যাচ
  useEffect(() => {
    const query = {};
    if (category) query.category = category;
    if (price) query.price = price;
    if (ratings) query.ratings = ratings;
    if (availability) query.availability = availability;
    if (search) query.search = search;
    if (page) query.page = page;
    if (sortBy) query.sort = sortBy;

    dispatch(fetchAllProducts(Object.keys(query).length > 0 ? query : undefined));
  }, [dispatch, category, price, ratings, availability, search, page, sortBy]);

  // একটিভ ফিল্টার কাউন্ট
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count++;
    if (price) count++;
    if (ratings) count++;
    if (availability) count++;
    if (search) count++;
    return count;
  }, [category, price, ratings, availability, search]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setPrice("");
    setRatings("");
    setAvailability("");
    setSortBy("newest");
    setPage(1);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-8 sm:py-12 select-none transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-[32px] bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-xl shadow-[#9c5b6f]/5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 border border-[#9c5b6f]/20 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9c5b6f] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9c5b6f] dark:text-[#e4a8b8]">
                  Premium Catalog
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#2b141d] dark:text-[#f7eef1] tracking-tight">
                Curated Collection
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-80 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search by keyword, item or brand..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-black/40 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-[#2b141d] dark:text-[#f7eef1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] shadow-inner transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#9c5b6f]/25 transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap overflow-hidden"
              >
                <Bot className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                <span>AI Concierge</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden relative p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-slate-100 transition-all cursor-pointer"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9c5b6f] text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

         
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
              <span className="text-xs font-semibold text-slate-400 dark:text-rose-200/50 mr-1">
                Active Filters:
              </span>
              
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] text-xs font-semibold">
                  Category: {category}
                  <button onClick={() => setCategory("")} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {availability && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  {availability === "in-stock"
                    ? "In Stock"
                    : availability === "limited"
                    ? "Limited Stock"
                    : "Out of Stock"}
                  <button onClick={() => setAvailability("")} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {price && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] text-xs font-semibold">
                  Price: ${price}
                  <button onClick={() => setPrice("")} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {ratings && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  {ratings}+ Stars
                  <button onClick={() => setRatings("")} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-rose-100 text-xs font-semibold">
                  "{search}"
                  <button onClick={() => setSearch("")} className="hover:opacity-75 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-4 ml-2 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          
          <aside
            className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-[#150d11] p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:w-72 lg:bg-white/70 lg:dark:bg-white/[0.02] lg:p-6 lg:rounded-[32px] lg:border lg:border-slate-200/80 lg:dark:border-white/10 lg:shadow-sm lg:backdrop-blur-xl lg:translate-x-0 ${
              isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2 text-[#2b141d] dark:text-[#f7eef1] font-extrabold text-base tracking-tight">
                <SlidersHorizontal className="w-4 h-4 text-[#9c5b6f]" />
                <span>Filters & Refine</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-400 hover:text-[#9c5b6f] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="lg:hidden p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] lg:max-h-none pr-1">
              
              
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  <span>Availability</span>
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Items", value: "" },
                    { label: "In Stock", value: "in-stock" },
                    { label: "Limited Stock", value: "limited" },
                    { label: "Out of Stock", value: "out-of-stock" },
                  ].map((status) => {
                    const isSelected = availability === status.value;
                    return (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => {
                          setAvailability(status.value);
                          setPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                            : "text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{status.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              
              <div className="pt-5 border-t border-slate-100 dark:border-white/10">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 flex items-center gap-1.5 mb-3">
                  <Layers className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  <span>Category</span>
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      category === ""
                        ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                        : "text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>All Categories</span>
                    {category === "" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {categories?.map((cat, idx) => {
                    const catName = typeof cat === "string" ? cat : cat.name;
                    const isSelected = category === catName;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCategory(catName);
                          setPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                            : "text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{catName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

             
              <div className="pt-5 border-t border-slate-100 dark:border-white/10">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 flex items-center gap-1.5 mb-3">
                  <DollarSign className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  <span>Price Range</span>
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Prices", value: "" },
                    { label: "Under $50", value: "0-50" },
                    { label: "$50 - $100", value: "50-100" },
                    { label: "$100 - $300", value: "100-300" },
                    { label: "Over $300", value: "300-10000" },
                  ].map((range) => {
                    const isSelected = price === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => {
                          setPrice(range.value);
                          setPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                            : "text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{range.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

             
              <div className="pt-5 border-t border-slate-100 dark:border-white/10">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 flex items-center gap-1.5 mb-3">
                  <Star className="w-3.5 h-3.5 text-[#9c5b6f]" />
                  <span>Customer Rating</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[4, 3, 2, 1].map((star) => {
                    const isSelected = ratings === String(star);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRatings(isSelected ? "" : String(star));
                          setPage(1);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-rose-100 hover:bg-slate-200 dark:hover:bg-white/10"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{star}★ & up</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          
          {isMobileFilterOpen && (
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
            />
          )}

         
          <main className="flex-1 w-full">
            
           
            <div className="flex items-center justify-between mb-6 px-1">
              <span className="text-xs font-bold text-slate-500 dark:text-rose-200/60">
                Showing <span className="text-[#2b141d] dark:text-[#f7eef1] font-extrabold">{safeProducts.length}</span> of {totalProducts || safeProducts.length} items
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] focus:outline-none focus:ring-1 focus:ring-[#9c5b6f] cursor-pointer"
                >
                  <option value="newest" className="dark:bg-[#150d11]">Newest Arrivals</option>
                  <option value="price_low" className="dark:bg-[#150d11]">Price: Low to High</option>
                  <option value="price_high" className="dark:bg-[#150d11]">Price: High to Low</option>
                  <option value="top_rated" className="dark:bg-[#150d11]">Highest Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="min-h-[450px] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-[#9c5b6f]/30 border-t-[#9c5b6f] rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-400 dark:text-rose-200/50">
                  Fetching exquisite items...
                </p>
              </div>
            ) : safeProducts.length === 0 ? (
              <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-12 bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl rounded-[32px] border border-slate-200/80 dark:border-white/10">
                <div className="w-16 h-16 rounded-3xl bg-[#9c5b6f]/10 text-[#9c5b6f] flex items-center justify-center mb-4">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#2b141d] dark:text-[#f7eef1]">
                  No items matched your refinement
                </h3>
                <p className="text-xs text-slate-400 dark:text-rose-200/50 mt-1 max-w-sm">
                  We couldn't find any products with your current filter choices. Try clearing some filters or search with different keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-3 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold shadow-lg shadow-[#9c5b6f]/25 transition-all cursor-pointer active:scale-95"
                >
                  Reset All Refinements
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeProducts.map((product, idx) => (
                    <ProductCard key={product._id || product.id || idx} product={product} />
                  ))}
                </div>

              
                {totalProducts > 9 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalItems={totalProducts}
                      itemsPerPage={9}
                      onPageChange={(newPage) => {
                        setPage(newPage);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>
      {isAiModalOpen && (
        <AISearchModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      )}
    </div>
  );
};

export default Products;