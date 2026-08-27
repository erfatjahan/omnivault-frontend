import React, { useState } from "react";
import { X, Search, Bot, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";

const AISearchModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
    
      const response = await axios.post(
        "http://localhost:4000/api/v1/product/ai-search",
        { 
          userPrompt: prompt.trim(),
          prompt: prompt.trim() 
        },
        { withCredentials: true }
      );

      const responseProducts = response.data?.products || [];

      if (responseProducts.length > 0) {
        setResults(responseProducts);
      } else {
        setResults([]);
        setError(response.data?.message || "No products found matching your prompt.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not find matching products. Please try another query."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };


  const getProductImage = (product) => {
    let images = product?.images;
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch {
        images = [];
      }
    }
    return (
      images?.[0]?.url ||
      images?.[0] ||
      product?.image ||
      "https://placehold.co/200x200?text=Product"
    );
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = product.id || product._id;
    const imageSrc = getProductImage(product);

    dispatch(
      addToCart({
        id: productId,
        productId,
        name: product.name || product.title,
        price: Number(product.price) || 0,
        image: imageSrc,
        stock: product.stock !== undefined ? Number(product.stock) : 10,
        quantity: 1,
      })
    );
    dispatch(toggleCart());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#150d11] rounded-[32px] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9c5b6f] to-amber-500 text-white flex items-center justify-center shadow-md shadow-[#9c5b6f]/25">
                <Bot className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2b141d] dark:text-[#f7eef1]">
                  AI Semantic Search
                </h3>
                <p className="text-xs text-slate-400 dark:text-rose-200/50">
                  Search naturally
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-rose-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleAISearch} className="relative mb-6">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you are looking for..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-[#2b141d] dark:text-[#f7eef1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all shadow-xs"
              autoFocus
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold shadow-md shadow-[#9c5b6f]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Find</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#9c5b6f]/30 border-t-[#9c5b6f] rounded-full animate-spin" />
                <p className="text-xs text-slate-400 dark:text-rose-200/50">
                  AI is finding the best matches...
                </p>
              </div>
            ) : results.length > 0 ? (
              results.map((product, idx) => {
                const productId = product.id || product._id || idx;
                const imageSrc = getProductImage(product);

                return (
                  <div
                    key={productId}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-[#9c5b6f]/40 transition-all"
                  >
                    <Link
                      to={`/product/${productId}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 flex-1 overflow-hidden"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-white/5 flex-shrink-0 border border-slate-200/50 dark:border-white/5">
                        <img
                          src={imageSrc}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/200x200?text=Product";
                          }}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-[#2b141d] dark:text-[#f7eef1] truncate hover:text-[#9c5b6f] transition-colors">
                          {product.name || product.title}
                        </h4>
                        <p className="text-xs font-extrabold text-[#9c5b6f] dark:text-[#e4a8b8] mt-0.5">
                          ${Number(product.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="p-2.5 rounded-xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 hover:bg-[#9c5b6f] text-[#9c5b6f] hover:text-white dark:text-[#e4a8b8] dark:hover:text-white transition-all active:scale-95 cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                );
              })
            ) : (
              prompt &&
              !loading &&
              !error && (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-rose-200/50">
                  No products matched your description.
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AISearchModal;