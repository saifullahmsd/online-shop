import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../api/dummyProductsApi";
import { toast } from "react-hot-toast";
import { FloppyDisk, ArrowLeft, CircleNotch } from "phosphor-react";
import Skeleton from "../../components/shared/Skeleton";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: product, isLoading } = useGetProductByIdQuery(id, {
    skip: !isEditMode,
  });
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    brand: "",
    category: "",
    thumbnail: "",
    images: ["", "", ""],
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
        images: product.images || ["", "", ""],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditMode) {
        await updateProduct({ id, ...formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product created successfully!");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditMode && isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );

  const inputClass =
    "w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-primary";
  const labelClass =
    "mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300";
  const cardClass =
    "rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 dark:bg-slate-800 dark:border-slate-700";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:text-primary dark:bg-slate-800 dark:text-gray-300 dark:border dark:border-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <div className={cardClass}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Basic Information
            </h3>
            <div>
              <label className={labelClass}>Product Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. iPhone 15 Pro"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="product description.."
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Images
            </h3>
            <div>
              <label className={labelClass}>Main Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
                required
              />
            </div>
            {formData.thumbnail && (
              <div className="h-40 w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-2 dark:bg-slate-900 dark:border-slate-700">
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardClass}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Pricing & Stock
            </h3>
            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Discount (%)</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Organization
            </h3>
            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. smartphones"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. apple"
                className={inputClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSaving ? (
              <>
                <CircleNotch className="animate-spin" size={20} /> Saving...
              </>
            ) : (
              <>
                <FloppyDisk size={20} weight="bold" /> Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
