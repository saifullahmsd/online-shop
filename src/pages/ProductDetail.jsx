import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useAddReviewMutation,
} from "../api/productsApi";
import {
  Star,
  Truck,
  ShieldCheck,
  ArrowCounterClockwise,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  SmileySad,
} from "phosphor-react";
import { motion } from "framer-motion";
import ImageGallery from "../components/product-detail/ImageGallery";
import Reviews from "../components/product-detail/Reviews";
import ReviewForm from "../components/product-detail/ReviewForm";
import ProductCard from "../components/shared/ProductCard";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import SEO from "../components/shared/SEO";
import PageTransition from "../components/shared/PageTransition";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";
import useAutoRetry from "../hooks/useAutoRetry";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(id);
  useAutoRetry(isError, refetch);

  const [addReview] = useAddReviewMutation();
  const { data: relatedData } = useGetAllProductsQuery(
    { category: product?.category, limit: 4 },
    { skip: !product }
  );

  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product?.id)
  );

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  const handleQuantityChange = (type) => {
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "inc" && quantity < (product?.stock || 10))
      setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantityToAdd: quantity }));
  };

  const handleReviewSubmit = async (newReview) => {
    await addReview({ productId: id, newReview }).unwrap();
  };

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20">
        <ErrorMessage
          message="We couldn't load the product details. Please check your connection."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6 text-gray-400 dark:bg-slate-800">
          <SmileySad size={48} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
          Product Not Found
        </h2>
        <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">
          The product you are looking for might have been removed or is
          temporarily unavailable.
        </p>
        <Link
          to="/products"
          className="rounded-lg bg-primary px-8 py-3 font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-500/30"
        >
          Browse Other Products
        </Link>
      </div>
    );
  }

  const reviews = product.reviews || [];
  const avgRating =
    reviews.length > 0
      ? (
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      ).toFixed(1)
      : product.rating;

  const originalPrice = product.price / (1 - product.discountPercentage / 100);
  const stockColor =
    product.stock < 10 ? "text-red-500" : "text-green-600 dark:text-green-400";

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <SEO
          title={product.title}
          description={product.description}
          image={product.thumbnail}
          url={window.location.href}
        />

        <nav className="mb-6 flex text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize text-gray-800 dark:text-gray-200">
            {product.category}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ImageGallery images={product.images} thumbnail={product.thumbnail} />

          <div className="flex flex-col">
            <span className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
              {product.brand || "Generic Brand"}
            </span>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Star weight="fill" />
                <span className="ml-1 font-bold text-gray-700 dark:text-gray-300">
                  {avgRating}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                | {reviews.length} Reviews
              </span>
              <span className={`text-sm font-medium ml-4 ${stockColor}`}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="mb-1 text-lg text-gray-400 line-through dark:text-gray-500">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="mb-1 rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      -{Math.round(product.discountPercentage)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Includes all taxes. Free shipping on orders over $50.
              </p>
            </div>

            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
              {product.description}
            </p>

            <div className="fixed bottom-0 inset-x-0 z-30 w-full border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-slate-900 dark:border-slate-800 md:static md:mb-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
              <div className="flex flex-col gap-4 sm:flex-row container mx-auto md:w-auto md:mx-0">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 md:w-auto">
                  <button
                    onClick={() => handleQuantityChange("dec")}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    <Minus />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    <Plus />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} weight="bold" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </motion.button>

                <button
                  onClick={handleWishlist}
                  className={`hidden rounded-lg border p-3 transition-colors sm:block ${isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500 dark:bg-red-900/20 dark:border-red-900"
                      : "border-gray-200 text-gray-400 hover:text-red-500 dark:border-slate-700 dark:text-gray-300 dark:hover:text-red-500"
                    }`}
                >
                  <Heart size={24} weight={isWishlisted ? "fill" : "bold"} />
                </button>
              </div>
            </div>

            <div className="h-24 md:h-0"></div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 sm:grid-cols-3 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={24} className="text-primary" />{" "}
                <span>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck size={24} className="text-primary" />{" "}
                <span>2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ArrowCounterClockwise size={24} className="text-primary" />{" "}
                <span>30 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reviews reviews={reviews} />
          </div>
          <div>
            <ReviewForm
              productId={parseInt(id)}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>
        </div>

        {relatedData?.products?.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {relatedData.products
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
