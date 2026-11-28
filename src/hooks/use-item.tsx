import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getItem, createItem, updateItem, deleteItem } from "@/utils/items";
import { useAuth } from "@/hooks/use-auth";
import {
  cancelItemReminder,
  notifyItemAdded,
  scheduleItemReminder,
  syncItemReminders,
} from "@/utils/notifications";
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
  const { isLoggedIn } = useAuth();
  const [item, setItem] = useState<Item[]>([]);
  // Load the user's items from the backend once they're signed in; clear on sign-out.
  useEffect(() => {
    let active = true;
    if (isLoggedIn !== true) {
      // Clear via the async result path (not a synchronous setState in the effect).
      Promise.resolve().then(() => {
        if (active) setItem([]);
      });
      return () => {
        active = false;
      };
    }
    getItem()
      .then((items) => {
        if (!active) return;
        setItem(items);
        // Re-sync local reminders for everything we loaded (best-effort).
        syncItemReminders(items).catch(() => {});
      })
      .catch(() => {
        // Leave the list empty; screens show their empty state.
      });
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  const handleAddItem = async (data: Item) => {
    const result = await createItem(data);
    const created = result.data.item as Item;
    setItem((prev) => [...prev, created]);
    scheduleItemReminder(created).catch(() => {});
    // TEMPORARY: immediate confirmation so you can see notifications work.
    notifyItemAdded(created).catch(() => {});
  };

  const handleUpdateItem = async (data: Item) => {
    const result = await updateItem(data);
    const updated = result.data.item as Item;
    setItem((prev) => prev.map((existing) => (existing.id === updated.id ? updated : existing)));
    scheduleItemReminder(updated).catch(() => {});
  };

  const handleGetItem = async () => {
    const result = await getItem();
    setItem(result);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setItem((prev) => prev.filter((existing) => existing.id !== id));
    cancelItemReminder(id).catch(() => {});
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
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
  

export function useItem() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItem must be used within an ItemProvider");
  }
  return context;
}
