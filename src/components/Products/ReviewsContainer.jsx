import React, { useState } from "react";
import { Star, Trash2, Send, MessageSquare, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { postReview, deleteReview } from "../../store/slices/productSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { toast } from "react-toastify";

const ReviewsContainer = ({ product = {}, productId: directProductId, reviews = [], productReviews = [] }) => {
  const dispatch = useDispatch();
  const { authUser, user } = useSelector((state) => state.auth || {});
  const currentUser = authUser || user;

  const { isPostingReview, isReviewDeleting } = useSelector(
    (state) => state.product || {}
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);


  const activeProductId =
    directProductId ||
    product?.id ||
    product?._id ||
    (typeof product === "string" ? product : null);

  const rawReviews = reviews.length > 0 ? reviews : productReviews;
  const safeReviews = Array.isArray(rawReviews) ? rawReviews : [];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      dispatch(toggleAuthPopup());
      return;
    }

    if (!activeProductId || activeProductId === "undefined") {
      toast.error("Product ID not found. Please refresh the page.");
      return;
    }

    if (!comment.trim()) return;

    dispatch(
      postReview({
        productId: activeProductId,
        rating: Number(rating),
        comment: comment.trim(),
        review: {
          rating: Number(rating),
          comment: comment.trim(),
        },
      })
    ).then((res) => {
      if (!res.error) {
        setComment("");
        setRating(5);
      }
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (!activeProductId) return;
    dispatch(deleteReview({ productId: activeProductId, reviewId }));
  };

  return (
    <section className="mt-8 select-none">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-[#9c5b6f] dark:text-[#e4a8b8]" />
        <h3 className="text-xl font-bold text-[#2b141d] dark:text-[#f7eef1]">
          Customer Reviews ({safeReviews.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
     
        <div className="lg:col-span-5 bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <h4 className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1] mb-1">
            Leave a Review
          </h4>
          <p className="text-xs text-slate-400 dark:text-rose-200/50 mb-4">
            Share your experience with this product
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
        
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 block mb-2">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-white/20"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-rose-100 ml-2">
                  {rating} of 5
                </span>
              </div>
            </div>

      
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-rose-200/60 block mb-2">
                Comment
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-[#2b141d] dark:text-[#f7eef1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c5b6f] transition-all resize-none shadow-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPostingReview || !comment.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold shadow-md shadow-[#9c5b6f]/25 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPostingReview ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>


        <div className="lg:col-span-7 space-y-4">
          {safeReviews.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-white/[0.02] rounded-3xl border border-slate-200/80 dark:border-white/10">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-2" />
              <h5 className="text-sm font-bold text-[#2b141d] dark:text-[#f7eef1]">
                No reviews yet
              </h5>
              <p className="text-xs text-slate-400 dark:text-rose-200/50 mt-1">
                Be the first to review this product!
              </p>
            </div>
          ) : (
            safeReviews.map((rev, idx) => {
              const reviewId = rev._id || rev.id || rev.review_id || idx;
              const reviewerUserId = rev.user_id || rev.user?.id || rev.user?._id || rev.user || rev.reviewer?.id;
              const isOwner =
                currentUser &&
                (currentUser.id === reviewerUserId || currentUser._id === reviewerUserId);

              const reviewerName = rev.user_name || rev.reviewer?.name || rev.user?.name || rev.name || "Verified Buyer";
              const reviewerAvatar = rev.user_avatar || rev.reviewer?.avatar || rev.user?.avatar?.url || rev.avatar?.url;

              return (
                <div
                  key={reviewId}
                  className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] flex items-center justify-center font-bold text-xs overflow-hidden">
                        {reviewerAvatar ? (
                          <img
                            src={typeof reviewerAvatar === "string" ? reviewerAvatar : reviewerAvatar.url || "/avatar-holder.avif"}
                            alt={reviewerName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 stroke-[2]" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#2b141d] dark:text-[#f7eef1]">
                          {reviewerName}
                        </h5>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (Number(rev.rating) || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200 dark:text-white/10"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(reviewId)}
                        disabled={isReviewDeleting}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#cfb0ba] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsContainer;