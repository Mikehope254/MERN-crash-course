import { useState } from "react";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [], //state variable initialized as an empty array to store ({name, price, image})

  setProducts: (products) => set({ products }), //this function takes an array of products as an argument and updates the product state
  //calls set({products}) to overwrite the products state with the new list

  //POST request to /api/products
  createProduct: async (newProduct) => {
    //validate inputs
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields" };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json(); //response from backend used to update the Zustand Store with the new product
    set((state) => ({ products: [...state.products, data.data] })); //This creates a new array with all previous products + the new product...data.data is the new product from the API response
    return { success: true, message: "Product created successfully" };
  },
  //GET request to /api/products
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },
  // DELETE request to /api/product
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    //updates the ui immediately after deletion, without needing a refresh
    set((state) => ({
      products: state.products.filter((products) => products._id !== pid), //filter method used to specify product to be deleted
    }));
    return { success: true, message: data.message };
  },
}));
