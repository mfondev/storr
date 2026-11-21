import { AxiosError } from "axios";
import { axiosInstance } from "./api";
import { Item } from "./types";

const getItem = async () => {
  try {
    const result = await axiosInstance.get("/items");
    return result.data.data.items;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to load items.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

const createItem = async (data: Item) => {
  try {
    const result = await axiosInstance.post("/items", data);
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to add the item.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

const updateItem = async (data: Item) => {
  try {
    const result = await axiosInstance.put(`/items/${data.id}`, data);
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update the item.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

const deleteItem = async (id: string) => {
    try {
        const result = await axiosInstance.delete(`/items/${id}`)
        return result.data
    } catch (error) {
         if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete the item.",
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

export { getItem, createItem, updateItem, deleteItem };
