import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 9,
  onPageChange,
}) => {
  const pageNumCurrent = Number(currentPage) || 1;
  const numTotalPages = Number(totalPages);
  const numTotalItems = Number(totalItems);
  const numItemsPerPage = Number(itemsPerPage) || 9;
  const computedTotalPages =
    numTotalPages > 0
      ? numTotalPages
      : numTotalItems > 0
      ? Math.ceil(numTotalItems / numItemsPerPage)
      : 1;

  if (computedTotalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (computedTotalPages <= maxVisible) {
      for (let i = 1; i <= computedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pageNumCurrent <= 3) {
        pages.push(1, 2, 3, 4, "...", computedTotalPages);
      } else if (pageNumCurrent >= computedTotalPages - 2) {
        pages.push(
          1,
          "...",
          computedTotalPages - 3,
          computedTotalPages - 2,
          computedTotalPages - 1,
          computedTotalPages
        );
      } else {
        pages.push(
          1,
          "...",
          pageNumCurrent - 1,
          pageNumCurrent,
          pageNumCurrent + 1,
          "...",
          computedTotalPages
        );
      }
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2 select-none py-4"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(pageNumCurrent - 1)}
        disabled={pageNumCurrent <= 1}
        className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-rose-200/50"
              >
                ...
              </span>
            );
          }

          const isActive = pageNumCurrent === pageNum;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange && onPageChange(Number(pageNum))}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/25 font-black"
                  : "bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(pageNumCurrent + 1)}
        disabled={pageNumCurrent >= computedTotalPages}
        className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </nav>
  );
};

export default Pagination;