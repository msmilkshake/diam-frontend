import { Sidebar } from "primereact/sidebar";
import {useContext, useEffect, useState} from "react";
import { Button } from "primereact/button";
import {CartContext, CartDispatchContext, CartItem} from "../contexts/CartContext.ts";
import ApiService from "../services/ApiService.ts";
import CartItemFunc from "./CartItemFunc.tsx";
import { LoginContext} from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";
import {ProductProps} from "./ProductCard.tsx";

const CartSidebar = ({ visible, setVisible }) => {
  const cartItems = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const user = useContext(LoginContext);
  const [total, setTotal] = useState();

  useEffect(() => {
    getDbCart()
  }, [user]);
  useEffect(() => {
    let totalprice=0;
    for(const item of cartItems!){
      totalprice+=(item.discountPrice || item.price)*item.quantity;
      // console.log(total);
    }
    setTotal(totalprice.toFixed(2));
  }, [cartItems]);

  const getDbCart = async () => {
    const cart = (await ApiService.get("/cart") ||
        []) as CartItem[];
    cartDispatch!({
      type: "restore",
      payload: cart,
    });
    // console.log(cart)
  }

  const handleClear = () => {
    if (user){
      axios.delete("http://localhost:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      })
      getDbCart()
    }
    else {
      cartDispatch!({type: "clear", payload: []});
    }
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
      // console.log("Encomenda realizada:", response.data);
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
            style={{width: "500px"}}
        >
            <h1>Carrinho de Compras</h1>
            <div>
                {cartItems!.length > 0 &&
                    cartItems!.map((item) => (
                        <CartItemFunc
                            key={item.id}
                            id={item.id}
                            qty={item.quantity}
                            price={item.discountPrice || item.price}
                        ></CartItemFunc>
                    ))}
                {cartItems?.length === 0 && <span>Carrinho vazio!</span>}
                {cartItems?.length !== 0 && <h3>Total: {total}€</h3>}
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


