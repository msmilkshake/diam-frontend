import {createContext, Dispatch} from "react";

export const CartContext = createContext<CartItem[] | null>(null);
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);

export type CartItem = {
  id: number;
  amount: number;
};

export type CartAction = {
  type: "add" | "remove";
  item: CartItem;
};

export const cartReducer = (cartItems: CartItem[], action: CartAction) => {
  const filteredCartItems = cartItems.filter(
    (item) => item.id !== action.item.id,
  );
  switch (action.type) {
    case "add": {
      return [...filteredCartItems, action.item];
    }
    case "remove":
      return filteredCartItems;
    default:
      return cartItems;
  }
};
