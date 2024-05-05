import { createContext, Dispatch } from "react";

export type CartItem = {
  id: number;
  quantity: number;
  price: number;
  discountPrice?: number;
};

export type CartAction = {
  type: "add" | "update" | "remove" | "clear" | "restore";
  payload: CartItem | CartItem[];
};

export const CartContext = createContext<CartItem[] | null>(null);
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(
  null,
);

export const cartReducer = (cartItems: CartItem[], action: CartAction): CartItem[] => {
  const filteredCartItems = cartItems.filter(
    (item) => item.id !== (action.payload as CartItem).id,
  );
  let results: CartItem[];
  switch (action.type) {
    case "add":
      results = [...filteredCartItems, action.payload as CartItem];
      break;

    case "update":
      results = cartItems.map((item) =>
        item.id === (action.payload as CartItem).id
          ? { ...item, quantity: (action.payload as CartItem).quantity, price: (action.payload as CartItem).price }
          : item,
      );
      break;

    case "remove":
      results = filteredCartItems;
      break;

    case "clear":
      results = [];
      break;

    case "restore":
      results = action.payload as CartItem[];
      break;

    default:
      return cartItems;
  }
  localStorage.setItem("anonymous-cart", JSON.stringify(results))
  return results
};
