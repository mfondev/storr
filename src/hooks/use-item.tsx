import { createContext, useState, type ReactNode } from "react";
import { getItem, createItem, updateItem, deleteItem } from "@/utils/items";
import { Item } from "@/utils/types";

type ItemProps = {
  addItem: (data: Item) => Promise<void>;
  updateItem: (data: Item) => Promise<void>;
  getItem: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  itemLength: number;
  item: Item[];
};

const ItemContext = createContext<ItemProps | null>(null);

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [item, setItem] = useState<Item[]>([]);

  const handleAddItem = async (data: Item) => {
    const result = await createItem(data);
    setItem((prev) => [...prev, result.data]);
  };

  const handleUpdateItem = async (data: Item) => {
    const result = await updateItem(data);
    setItem((prev) => prev.map((existing) => (existing.id === result.id ? result : existing)));
  };

  const handleGetItem = async () => {
    const result = await getItem();
    setItem(result);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setItem((prev) => prev.filter((existing) => existing.id !== id));
  };

  return (
    <ItemContext.Provider
      value={{
        itemLength: item.length,
        item,
        addItem: handleAddItem,
        updateItem: handleUpdateItem,
        getItem: handleGetItem,
        deleteItem: handleDeleteItem,
      }}>
      {children}
    </ItemContext.Provider>
  );
};
