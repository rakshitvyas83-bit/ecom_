"use client";

import { useEffect, useMemo, useState } from "react";
import { createProduct, updateProduct } from "@/lib/products";
import { deleteImages, uploadImages } from "@/lib/upload";
import type { Product, ProductCategory, ProductSize } from "@/types/product";

interface AdminProductFormProps {
  editProduct?: Product | null;
  onDone?: () => void;
}

const categories: ProductCategory[] = [
  "Work Wear",
  "Festive Wear",
  "Daily Wear",
  "Premium Collection"
];

const sizeOptions: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

type SizeStock = Record<ProductSize, string>;

const emptySizeStock = (): SizeStock => ({
  XS: "",
  S: "",
  M: "",
  L: "",
  XL: "",
  XXL: ""
});

type ExistingImage = { id: string; url: string };

const extractFileId = (value: string) => {
  const match = value.match(/\/files\/([^/?#]+)/);
  return match ? match[1] : value;
};

export default function AdminProductForm({ editProduct, onDone }: AdminProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discounted_price: "",
    category: "Daily Wear" as ProductCategory,
    isactive: true,
    isfeatured: false,
    isshowcased: false
  });
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [sizeStock, setSizeStock] = useState<SizeStock>(emptySizeStock);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editProduct) return;

    const nextStock = emptySizeStock();
    editProduct.sizeInventory.forEach((item) => {
      nextStock[item.size] = item.stock.toString();
    });

    setForm({
      name: editProduct.name,
      description: editProduct.description,
      price: editProduct.price.toString(),
      discounted_price: editProduct.discountPrice?.toString() ?? "",
      category: editProduct.category,
      isactive: editProduct.isactive !== false,
      isfeatured: editProduct.featured,
      isshowcased: editProduct.isshowcased ?? false
    });
    setSelectedSizes(editProduct.sizes);
    setSizeStock(nextStock);
    setExistingImages(
  editProduct.images.map((url, i) => ({
    id: editProduct.imageIds?.[i] ?? extractFileId(url),
    url
  }))
);
    setRemovedIds([]);
    setFiles([]);
  }, [editProduct]);

  const totalStock = useMemo(
    () =>
      selectedSizes.reduce(
        (total, size) => total + Number(sizeStock[size] || 0),
        0
      ),
    [selectedSizes, sizeStock]
  );

  const newPreviews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  useEffect(() => {
    return () => {
      newPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newPreviews]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size]
    );
  };

  const updateSizeStock = (size: ProductSize, value: string) => {
    setSizeStock({ ...sizeStock, [size]: value });
    setSelectedSizes((current) => (current.includes(size) ? current : [...current, size]));
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((cur) => cur.filter((img) => img.id !== id));
    setRemovedIds((cur) => [...cur, id]);
  };

  const removeNewFile = (index: number) => {
    setFiles((cur) => cur.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedSizes.length === 0) {
      alert("Select at least one size");
      return;
    }

    if (existingImages.length + files.length === 0) {
      alert("Add at least one image");
      return;
    }

    try {
      setLoading(true);

      const sizeInventory = selectedSizes.map((size) => ({
        size,
        stock: Number(sizeStock[size] || 0)
      }));

      const newIds = files.length > 0 ? await uploadImages(files) : [];
      const images = [...existingImages.map((img) => extractFileId(img.id)), ...newIds];
console.log("images being saved:", images);

const bad = images.find((id) => id.length > 50);
if (bad) {
  throw new Error(`Not a valid file ID: ${bad.slice(0, 80)}`);
}

      const payload = {
        name: form.name,
        description: form.description,
        fabric: editProduct?.fabric ?? "Cotton",
        price: Number(form.price),
        discounted_price: form.discounted_price ? Number(form.discounted_price) : undefined,
        category: form.category,
        stock: totalStock,
        sizes: selectedSizes,
        sizeInventory,
        images,
        featured: form.isfeatured,
        popular: editProduct?.popular ?? false,
        isactive: form.isactive,
        isshowcased: form.isshowcased
      };

      if (editProduct) {
        await updateProduct(editProduct.id, payload);
        if (removedIds.length > 0) {
          await deleteImages(removedIds);
        }
        alert("Product updated");
      } else {
        await createProduct(payload);
        alert("Product added");
      }

      onDone?.();
      setForm({
        name: "",
        description: "",
        price: "",
        discounted_price: "",
        category: "Daily Wear",
        isactive: true,
        isfeatured: false,
        isshowcased: false
      });
      setSelectedSizes([]);
      setSizeStock(emptySizeStock());
      setFiles([]);
      setExistingImages([]);
      setRemovedIds([]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ? `Error saving product: ${err.message}` : "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const discount =
    form.price && form.discounted_price
      ? Math.round(
          ((Number(form.price) - Number(form.discounted_price)) / Number(form.price)) * 100
        )
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-xl">
      <h2 className="text-lg font-semibold">
        {editProduct ? "Edit Product" : "Add Product"}
      </h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded" />
      <input name="discounted_price" value={form.discounted_price} onChange={handleChange} placeholder="Discount Price" className="w-full border p-2 rounded" />

      {discount > 0 && <p className="text-green-600">{discount}% discount</p>}

      <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-3 border p-3 rounded">
        <input
          name="isactive"
          type="checkbox"
          checked={form.isactive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <span className="font-medium">Active product</span>
      </label>

      <label className="flex items-center gap-3 border p-3 rounded">
        <input
          name="isfeatured"
          type="checkbox"
          checked={form.isfeatured}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <span className="font-medium">Featured product</span>
      </label>

      <label className="flex items-center gap-3 border p-3 rounded">
        <input
          name="isshowcased"
          type="checkbox"
          checked={form.isshowcased}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <span className="font-medium">Show in hero strip</span>
      </label>

      <div className="space-y-3">
        <p className="font-medium">Sizes and stock</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sizeOptions.map((size) => {
            const selected = selectedSizes.includes(size);

            return (
              <div key={size} className="flex items-center gap-3 border p-3 rounded">
                <input
                  id={`size-${size}`}
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSize(size)}
                  className="h-4 w-4"
                />
                <label htmlFor={`size-${size}`} className="w-10 font-medium">
                  {size}
                </label>
                <input
                  type="number"
                  min="0"
                  value={sizeStock[size]}
                  onChange={(e) => updateSizeStock(size, e.target.value)}
                  placeholder="Pieces"
                  className="min-w-0 flex-1 border p-2 rounded"
                />
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600">Total stock: {totalStock}</p>
      </div>

      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Current images</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative h-24 w-24">
                <img src={img.url} alt="" className="h-full w-full rounded border object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          e.target.value = "";
          setFiles((cur) => [...cur, ...picked]);
        }}
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative h-24 w-24">
              <img src={newPreviews[i]} alt="" className="h-full w-full rounded border object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white"
                aria-label="Remove new image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
        {loading ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}