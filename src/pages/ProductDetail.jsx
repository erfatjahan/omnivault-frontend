import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

 
  const productState = useSelector((state) => state.product || {});
  const { loading = false, productReviews = [] } = productState;


  const rawProduct =
    productState.productDetails?.product ||
    productState.productDetails?.data ||
    productState.productDetails ||
    productState.product?.product ||
    productState.product ||
    null;

  const product =
    rawProduct && typeof rawProduct === "object" && (rawProduct.name || rawProduct.title)
      ? rawProduct
      : null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);


  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader className="w-10 h-10 text-[#9c5b6f] animate-spin" />
        <p className="text-xs font-semibold text-slate-400 dark:text-rose-200/50">
          Loading product details...
        </p>
      </div>
    );
  }


  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md p-8 rounded-3xl bg-white/70 dark:bg-[#150d11]/80 border border-slate-200/80 dark:border-white/10 shadow-xl">
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
            Product Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-rose-200/60 mb-6">
            The requested product (ID: {id}) could not be found.
          </p>
          <Link
            to="/products"
            className="inline-flex px-6 py-2.5 rounded-xl bg-[#9c5b6f] text-white text-xs font-bold hover:bg-[#854b5d] transition-all shadow-md shadow-[#9c5b6f]/25"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ৪. প্রাইস, স্টক ও রেটিং পার্সিং
  const productPrice = Number(
    product.price ??
    product.unit_price ??
    product.cost ??
    product.regular_price ??
    0
  );

  const originalPrice = Number(
    product.originalPrice ??
    product.old_price ??
    product.mrp ??
    0
  );

  const productStock = Number(
    product.stock ??
    product.countInStock ??
    product.quantity ??
    10
  );

  const productRating = Number(
    product.ratings ??
    product.rating ??
    4.5
  );

  const reviewCount =
    product.numOfReviews ??
    product.numReviews ??
    productReviews.length ??
    0;

  const getImages = () => {
    let images = product.images;
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch {
        images = [];
      }
    }
    if (Array.isArray(images) && images.length > 0) {
      return images.map((img) =>
        typeof img === "string" ? img : img?.url || "https://placehold.co/600x600?text=Product"
      );
    }
    if (product.image) return [product.image];
    return ["https://placehold.co/600x600?text=Product"];
  };

  const imagesList = getImages();
  const currentImage = imagesList[selectedImage] || imagesList[0];

  const handleAddToCart = () => {
    const productId = product.id || product._id || id;
    dispatch(
      addToCart({
        id: productId,
        productId,
        name: product.name || product.title || "Product",
        price: productPrice,
        image: currentImage,
        stock: productStock,
        quantity,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-8 sm:py-12 select-none transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
      
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-lg group">
              <img
                src={currentImage}
                alt={product.name || product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {productStock <= 5 && productStock > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Limited Stock
                </span>
              )}
              {productStock === 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white dark:bg-white/5 border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? "border-[#9c5b6f] shadow-md shadow-[#9c5b6f]/20 scale-105"
                        : "border-slate-200/80 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{product.category || "General"}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {product.name || product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {productRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-rose-200/50">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>

         
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="text-3xl font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                {productPrice.toFixed(2)}
              </span>
              {originalPrice > 0 && originalPrice > productPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-rose-200/70 leading-relaxed">
              {product.description || "Crafted with premium materials for unmatched durability and comfort."}
            </p>

         
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-rose-100">Quantity:</span>
                <div className="inline-flex items-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 rounded-xl text-slate-600 dark:text-rose-100 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-900 dark:text-slate-100">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => (productStock > prev ? prev + 1 : prev))}
                    className="p-2 rounded-xl text-slate-600 dark:text-rose-100 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={productStock === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] border border-white/20 shadow-lg shadow-[#9c5b6f]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{productStock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                    isWishlisted
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      : "bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-rose-100 hover:border-[#9c5b6f]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name || product.title, url: window.location.href });
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-rose-100 hover:border-[#9c5b6f] transition-all cursor-pointer"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

           
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10 text-[11px] font-semibold text-slate-500 dark:text-rose-200/60">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#9c5b6f]" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>30-Day Return</span>
              </div>
            </div>
          </div>
        </div>

      
        <div className="pt-8">
          <div className="flex items-center gap-4 border-b border-slate-200/80 dark:border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "description"
                  ? "border-[#9c5b6f] text-[#9c5b6f] dark:text-[#e4a8b8]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              Description & Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === "reviews"
                  ? "border-[#9c5b6f] text-[#9c5b6f] dark:text-[#e4a8b8]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              Customer Reviews ({reviewCount})
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#150d11]/80 border border-slate-200/80 dark:border-white/10 shadow-sm">
            {activeTab === "description" ? (
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-rose-100/80 leading-relaxed space-y-4">
                <p>{product.description || "No description provided."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Category: </span>
                    <span>{product.category || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Stock Status: </span>
                    <span>{productStock > 0 ? `${productStock} Units Available` : "Out of Stock"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <ReviewsContainer productId={id} reviews={productReviews} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;