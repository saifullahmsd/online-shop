import React from "react";
import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../../api/productsApi";
import ProductCard from "../shared/ProductCard";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery({ limit: 8 });

  if (isError) return null;

  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Featured Products
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Handpicked selections just for you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/products"
          className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-primary dark:hover:bg-blue-700"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
