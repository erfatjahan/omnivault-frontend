import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";
import { useDispatch } from "react-redux";

const ProductSlider = ({ title, products = [] }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;
    const itemToAdd = {
      id: product._id || product.id,
      productId: product._id || product.id,
      name: product.name || product.title,
      price: Number(product.price) || 0,
      image:
        product.images?.[0]?.url ||
        product.images?.[0] ||
        product.image ||
        "https://placehold.co/400x400?text=Product",
      stock: product.stock !== undefined ? Number(product.stock) : 10,
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
    dispatch(toggleCart()); 
  };

  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 select-none">

      <div className="flex items-end justify-between mb-8 px-1">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#9c5b6f] dark:text-[#e4a8b8] block mb-1">
            Curated Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2b141d] dark:text-[#f7eef1]">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* View All Button - শুধু New Arrivals বা অন্য স্লাইডারেও দেখাবে */}
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#9c5b6f]/10 hover:bg-[#9c5b6f] text-[#9c5b6f] hover:text-white dark:bg-[#9c5b6f]/20 dark:text-[#e4a8b8] dark:hover:bg-[#9c5b6f] dark:hover:text-white text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 cursor-pointer"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 cursor-pointer"
              aria-label="Next Products"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto scrollbar-none pb-6 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {safeProducts.map((product, idx) => {
          const productId = product?._id || product?.id || `product-${idx}`;
          const imageSrc =
            product?.images?.[0]?.url ||
            product?.images?.[0] ||
            product?.image ||
            "https://placehold.co/400x400?text=Product";
          const rating = Number(product?.ratings || product?.rating || 5);
          const isOutOfStock =
            product?.stock !== undefined && Number(product.stock) <= 0;

          return (
            <div
              key={productId}
              className="group flex-shrink-0 w-[260px] sm:w-[280px] bg-white dark:bg-white/[0.04] backdrop-blur-xl rounded-[28px] border border-slate-200/80 dark:border-white/10 shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-xl dark:hover:border-[#9c5b6f]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
            >
              <div>

                <Link
                  to={`/product/${productId}`}
                  className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-white/5 rounded-t-[28px]"
                >
                  <img
                    src={imageSrc}
                    alt={product?.name || product?.title || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x400?text=No+Image";
                    }}
                  />

                  {isOutOfStock ? (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/90 text-white backdrop-blur-md shadow-xs">
                      Sold Out
                    </span>
                  ) : (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/90 dark:bg-black/60 text-[#9c5b6f] dark:text-[#e4a8b8] backdrop-blur-md shadow-xs border border-white/20">
                      In Stock
                    </span>
                  )}
                </Link>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-rose-200/50">
                      ({product?.numOfReviews || product?.reviews?.length || 0})
                    </span>
                  </div>

                  <Link to={`/product/${productId}`}>
                    <h3 className="font-bold text-sm text-[#2b141d] dark:text-[#f7eef1] hover:text-[#9c5b6f] dark:hover:text-[#e4a8b8] line-clamp-1 transition-colors">
                      {product?.name || product?.title || "Untitled Product"}
                    </h3>
                  </Link>
                </div>
              </div>


              <div className="p-5 pt-0 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-rose-200/50 block leading-none mb-1">
                    Price
                  </span>
                  <span className="text-lg font-extrabold text-[#9c5b6f] dark:text-[#e4a8b8]">
                    ${Number(product?.price || 0).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isOutOfStock}
                  className="p-3 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white shadow-md shadow-[#9c5b6f]/25 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSlider;