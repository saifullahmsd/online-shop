import React from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "phosphor-react";

const SearchSuggestions = ({
  suggestions,
  isLoading,
  closeSearch,
  searchTerm,
}) => {
  if (!searchTerm) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:bg-slate-800 dark:border-slate-700">
      {isLoading ? (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <MagnifyingGlass
            className="mx-auto mb-2 animate-bounce text-primary"
            size={20}
          />
          Searching...
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <ul className="max-h-80 overflow-y-auto custom-scrollbar">
          {suggestions.map((product) => (
            <li
              key={product.id}
              className="border-b border-gray-50 last:border-none dark:border-slate-700"
            >
              <Link
                to={`/products/${product.id}`}
                onClick={closeSearch}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-slate-900">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <h4 className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    in {product.category}
                  </p>
                </div>

                <span className="text-sm font-bold text-primary">
                  ${product.price}
                </span>
              </Link>
            </li>
          ))}

          <li className="bg-gray-50 p-3 text-center dark:bg-slate-900">
            <Link
              to={`/products?search=${searchTerm}`}
              onClick={closeSearch}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all results
            </Link>
          </li>
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No products found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
