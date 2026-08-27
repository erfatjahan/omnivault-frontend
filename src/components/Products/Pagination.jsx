import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages,
  totalItems,
  itemsPerPage = 9,
  onPageChange,
}) => {

  const computedTotalPages =
    totalPages || (totalItems ? Math.ceil(totalItems / itemsPerPage) : 1);

  if (computedTotalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (computedTotalPages <= maxVisible) {
      for (let i = 1; i <= computedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", computedTotalPages);
      } else if (currentPage >= computedTotalPages - 2) {
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
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          computedTotalPages
        );
      }
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2 select-none"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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

          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/25"
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === computedTotalPages}
        className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-rose-100 hover:bg-[#9c5b6f] hover:text-white dark:hover:bg-[#9c5b6f] hover:border-transparent transition-all shadow-xs active:scale-90 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </nav>
  );
};

export default Pagination;