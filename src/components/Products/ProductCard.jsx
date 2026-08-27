import React from "react";
import { Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const productId = product._id || product.id;
  const imageSrc =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/400x400?text=Product";
  const rating = Number(product.ratings || product.rating || 5);
  const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToAdd = {
      id: productId,
      productId: productId,
      name: product.name || product.title,
      price: Number(product.price) || 0,
      image: imageSrc,
      stock: product.stock !== undefined ? Number(product.stock) : 10,
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
    dispatch(toggleCart());
  };

  return (
    <div className="group bg-white dark:bg-white/[0.04] backdrop-blur-xl rounded-2xl sm:rounded-[28px] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:border-[#9c5b6f]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 select-none">
      <div>
  
        <Link
          to={`/product/${productId}`}
          className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-white/5 rounded-t-2xl sm:rounded-t-[28px]"
        >
          <img
            src={imageSrc}
            alt={product.name || product.title || "Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x400?text=No+Image";
            }}
          />

          {isOutOfStock ? (
            <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/90 text-white backdrop-blur-md">
              Sold Out
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/90 dark:bg-black/60 text-[#9c5b6f] dark:text-[#e4a8b8] backdrop-blur-md border border-white/20">
              In Stock
            </span>
          )}
        </Link>

  
        <div className="p-3.5 sm:p-5">
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-rose-200/50">
              ({product.numOfReviews || product.reviews?.length || 0})
            </span>
          </div>

          <Link to={`/product/${productId}`}>
            <h3 className="font-bold text-xs sm:text-sm text-[#2b141d] dark:text-[#f7eef1] hover:text-[#9c5b6f] dark:hover:text-[#e4a8b8] line-clamp-1 transition-colors">
              {product.name || product.title || "Untitled Product"}
            </h3>
          </Link>
        </div>
      </div>

  
      <div className="p-3.5 sm:p-5 pt-0 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 block leading-none mb-0.5 sm:mb-1">
            Price
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#9c5b6f] dark:text-[#e4a8b8]">
            ${Number(product.price || 0).toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white shadow-md shadow-[#9c5b6f]/25 transition-all duration-300 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;