import React from "react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../api/productsApi";
import {
  CaretRight,
  Tag,
  DeviceMobile,
  TShirt,
  House,
  Watch,
  FirstAid,
  Sunglasses,
} from "phosphor-react";
import Skeleton from "../components/shared/Skeleton";
import PageTransition from "../components/shared/PageTransition";

const getCategoryIcon = (category) => {
  if (category.includes("phone") || category.includes("laptop"))
    return <DeviceMobile size={32} />;
  if (
    category.includes("shirt") ||
    category.includes("dress") ||
    category.includes("shoes")
  )
    return <TShirt size={32} />;
  if (
    category.includes("home") ||
    category.includes("furniture") ||
    category.includes("decoration")
  )
    return <House size={32} />;
  if (category.includes("watch") || category.includes("jewel"))
    return <Watch size={32} />;
  if (category.includes("beauty") || category.includes("skin"))
    return <FirstAid size={32} />;
  if (category.includes("sunglasses")) return <Sunglasses size={32} />;
  return <Tag size={32} />;
};

const Categories = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load categories.
      </div>
    );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Find exactly what you are looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category}`}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="mb-4 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary-light">
                {getCategoryIcon(category)}
              </div>

              <h3 className="relative z-10 text-lg font-bold capitalize text-gray-800 transition-colors group-hover:text-primary dark:text-gray-100 dark:group-hover:text-primary-light">
                {category.replace("-", " ")}
              </h3>

              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary-light">
                Explore <CaretRight weight="bold" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Categories;
