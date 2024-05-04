import { createContext, Dispatch } from "react";

export type CartItem = {
  id: number;
  amount: number;
};

export type CartAction = {
  type: "add" | "update" | "remove" | "clear" | "restore";
  payload: CartItem | CartItem[];
};

export const CartContext = createContext<CartItem[] | null>(null);
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(
  null,
);

export const cartReducer = (cartItems: CartItem[], action: CartAction) => {
  const filteredCartItems = cartItems.filter(
    (item) => item.id !== (action.payload as CartItem).id,
  );
  switch (action.type) {
    case "add": {
      return [...filteredCartItems, action.payload];
    }

    case "update": {
      return cartItems.map((item) =>
        item.id === (action.payload as CartItem).id
          ? { ...item, amount: (action.payload as CartItem).amount }
          : item,
      );
    }

    case "remove":
      return filteredCartItems;

    case "clear":
      return [];

    case "restore":
      return action.payload as CartItem[];

    default:
      return cartItems;
  }
};
