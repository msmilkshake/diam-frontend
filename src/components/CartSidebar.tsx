import { Sidebar } from "primereact/sidebar";
import { useContext, useEffect } from "react";
import { Button } from "primereact/button";
import {CartContext, CartDispatchContext, CartItem} from "../contexts/CartContext.ts";
import ApiService from "../services/ApiService.ts";
import CartItemFunc from "./CartItemFunc.tsx";
import { LoginContext} from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";

const CartSidebar = ({ visible, setVisible }) => {
  const cartItems = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const user = useContext(LoginContext);

  useEffect(() => {
    getDbCart()
  }, [user]);

  const getDbCart = async () => {
    const cart = (await ApiService.get("/cart") ||
        []) as CartItem[];
    cartDispatch!({
      type: "restore",
      payload: cart,
    });
    console.log(cart)
  }

  const handleClear = () => {
    cartDispatch!({ type: "clear", payload: [] });
  };
  const handlePurchase = async () => {
    if (user) {
      const response = await axios.post(
        "http://localhost:8000/api/orders",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        },
      );
      console.log("Encomenda realizada:", response.data);
    }
    else{
      handleClear();
    }
  };


  return (
    <>
      <Sidebar
        position={"right"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "500px" }}
      >
        <div>
          {cartItems!.length > 0 &&
            cartItems!.map((item) => (
              <CartItemFunc
                key={item.id}
                id={item.id}
                qty={item.quantity}
                price={item.discountPrice  || item.price}
              ></CartItemFunc>
            ))}
          {cartItems?.length === 0 && <span>empty cart</span>}
        </div>
        <div className="flex flex-row gap-8 mt-5">
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handlePurchase}>Finalizar</Button>
        </div>
      </Sidebar>
    </>
  );
};

export default CartSidebar;


