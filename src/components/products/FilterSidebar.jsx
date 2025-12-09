import React from "react";
import { useGetCategoriesQuery } from "../../api/productsApi";
import { X } from "phosphor-react";
import Skeleton from "../shared/Skeleton";

const FilterSidebar = ({
  filters,
  onCategoryChange,
  onPriceChange,
  onClear,
  isOpen,
  closeSidebar,
}) => {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <>
      {/* Mobile Overlay  */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR MAIN CONTAINER */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out
          dark:bg-slate-800 dark:shadow-none
          
          /*  DESKTOP STYLES  */
          lg:sticky lg:top-24 lg:z-0 lg:block lg:w-full lg:transform-none lg:shadow-none 
          lg:rounded-xl lg:border lg:border-gray-100 lg:dark:border-slate-700 lg:h-fit lg:max-h-[calc(100vh-120px)] 
          lg:overflow-y-auto 
          custom-scrollbar
        
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header (Mobile Only) */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <span className="text-lg font-bold dark:text-white">Filters</span>
          <button onClick={closeSidebar} className="dark:text-white">
            <X size={24} />
          </button>
        </div>

        <button
          onClick={onClear}
          className="mb-6 w-full rounded-lg border border-red-500 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Reset All Filters
        </button>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="mb-3 font-bold text-gray-800 dark:text-white">
            Categories
          </h3>
          <div className="flex flex-col  pr-2 custom-scrollbar">
            <button
              onClick={() => onCategoryChange("all")}
              className={`mb-2 text-left text-sm hover:text-primary dark:hover:text-primary-light ${
                !filters.category || filters.category === "all"
                  ? "font-bold text-primary dark:text-primary-light"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              All Products
            </button>

            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              categories?.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`mb-2 text-left text-sm capitalize hover:text-primary dark:hover:text-primary-light ${
                    filters.category === cat
                      ? "font-bold text-primary dark:text-primary-light"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {cat.replace("-", " ")}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="mb-3 font-bold text-gray-800 dark:text-white">
            Price Range
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={onPriceChange}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={onPriceChange}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="mb-3 font-bold text-gray-800 dark:text-white">
            Min Rating
          </h3>
          <input
            type="range"
            name="minRating"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={onPriceChange}
            className="w-full accent-primary cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-slate-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>0 Stars</span>
            <span className="font-bold text-primary dark:text-primary-light">
              {filters.minRating}+ Stars
            </span>
            <span>5 Stars</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
