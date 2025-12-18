import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../api/productsApi";
import { Funnel, CircleNotch } from "phosphor-react";

// Components
import ProductCard from "../components/shared/ProductCard";
import FilterSidebar from "../components/products/FilterSidebar";
import SortDropdown from "../components/products/SortDropdown";
import ErrorMessage from "../components/ui/ErrorMessage";
import SEO from "../components/shared/SEO";
import PageTransition from "../components/shared/PageTransition";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import useAutoRetry from "../hooks/useAutoRetry";
import useDebounce from "../hooks/useDebounce";
import { DEBOUNCE, PAGINATION } from "../utils/constants";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(PAGINATION.ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // Initialize State
  const initialFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || 0,
    sortBy: searchParams.get("sortBy") || "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    if (urlSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: urlSearch }));
    }

    const urlCategory = searchParams.get("category") || "all";
    if (urlCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: urlCategory }));
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(filters.search, DEBOUNCE.SEARCH);

  //  Sync State
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;

    if (filters.category && filters.category !== "all")
      params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating > 0) params.minRating = filters.minRating;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    setDisplayLimit(12);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.category, filters.sortBy, filters.search]);

  // API Query
  const [sortKey, sortOrder] = filters.sortBy.split("-");
  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({
    search: debouncedSearch,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    sortBy: sortKey,
    order: sortOrder,
  });
  useAutoRetry(isError, refetch);
  const allProducts = data?.products || [];

  // Pagination
  const visibleProducts = allProducts.slice(0, displayLimit);
  const hasMore = displayLimit < allProducts.length;

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayLimit((prev) => prev + PAGINATION.ITEMS_PER_PAGE);
          setIsLoadingMore(false);
        }, 500);
      }
    },
    [hasMore, isLoadingMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [handleObserver]);

  // Handlers
  const handleCategoryChange = useCallback((cat) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    setIsSidebarOpen(false);
  }, []);

  const handlePriceChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      minRating: 0,
      sortBy: "",
    });
    setDisplayLimit(12);
    setIsSidebarOpen(false);
  }, []);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-4 max-w-[1600px]">
        <SEO
          title="All Products"
          description="Browse our extensive collection."
        />

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {filters.category === "all"
              ? "All Products"
              : `Category: ${filters.category}`}
          </h1>
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-medium dark:border-slate-700 dark:text-gray-200 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Funnel /> Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onClear={handleClearFilters}
              isOpen={isSidebarOpen}
              closeSidebar={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onClear={handleClearFilters}
              isOpen={isSidebarOpen}
              closeSidebar={() => setIsSidebarOpen(false)}
            />
          </div>

          <div className="min-w-0">
            {/* Controls */}
            <div className="mb-6 flex justify-end rounded-xl bg-white p-4 shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
              <SortDropdown
                sort={filters.sortBy}
                setSort={(val) =>
                  setFilters((prev) => ({ ...prev, sortBy: val }))
                }
              />
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <ErrorMessage
                message="We couldn't load the products."
                onRetry={refetch}
              />
            ) : allProducts.length === 0 ? (
              <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                <p className="text-xl">
                  No products found matching "{filters.search}".
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div
                    ref={observerTarget}
                    className="mt-8 flex justify-center py-4"
                  >
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <CircleNotch size={24} className="animate-spin" /> Loading
                      more...
                    </div>
                  </div>
                )}
                {!hasMore && (
                  <p className="mt-8 text-center text-gray-400 text-sm">
                    You've reached the end of the list.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
