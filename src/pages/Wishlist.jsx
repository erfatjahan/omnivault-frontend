import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { removeFromWishlist } from "../store/slices/wishlistSlice"; 
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  

  const wishlistItems = useSelector((state) => state.wishlist?.wishlist || state.wishlist?.items || []);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info("Removed from wishlist");
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id || item._id || item.productId));
    toast.success("Moved to cart!");
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white dark:bg-[#150d11] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#9c5b6f] fill-[#9c5b6f]" /> My Wishlist
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your saved favorite products.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9c5b6f] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Your wishlist is empty</h3>
              <p className="text-xs text-slate-400">Click the heart icon on any product to save it for later.</p>
            </div>
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-[#9c5b6f] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#854b5d] transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const pId = item.id || item._id || item.productId;
              return (
                <div
                  key={pId}
                  className="bg-white dark:bg-[#150d11] rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between group"
                >
                  <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-900">
                    <img
                      src={item.image || item.images?.[0] || "https://placehold.co/300x300?text=Product"}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(pId)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/60 text-rose-500 hover:bg-white dark:hover:bg-black transition-all shadow-md cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {item.name || item.title}
                      </h3>
                      <p className="text-xs font-black text-[#9c5b6f] mt-1">
                        ৳{Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2.5 bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
export default Wishlist;