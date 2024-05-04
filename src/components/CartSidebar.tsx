import { Sidebar } from "primereact/sidebar";
import { useContext, useEffect, useReducer, useState } from "react";
import "primeflex/primeflex.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { CartContext, CartDispatchContext } from "../contexts/CartContext.ts";
import { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";
import { LoginContext, loginReducer } from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";

const CartSidebar = ({ visible, setVisible }) => {
  const cartItems = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const user = useContext(LoginContext);

  const handleClear = () => {
    cartDispatch!({ type: "clear", payload: [] });
  };
  const handlePurchase = async () => {
    //TODO
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
    // handleClear();
  };

  const [product, setProduct] = useState<ProductProps>();

  const getProduct = async (id?: number) => {
    return await ApiService.get(`/products/${id}`);
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
              <CartItem
                key={item.id}
                id={item.id}
                qty={item.quantity}
                price={item.price}
              ></CartItem>
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

const CartItem = ({ id, qty, price }) => {
  const cartDispatch = useContext(CartDispatchContext);
  const [product, setProduct] = useState<ProductProps>();
  const user = useContext(LoginContext);

  const getProduct = async (id?: number) => {
    // console.log(id)
    return await ApiService.get(`/products/${id}`);
  };

  useEffect(() => {
    getProduct(id).then((product: ProductProps) => {
      setProduct(product);
    });
    if (qty === 1) {
      setIsButtonDisabled(true);
    }
  }, []);

  const handleUpdate = (factor: number) => {
    if (qty + factor === 1) {
      setIsButtonDisabled(true);
    } else if (qty + factor === 2) {
      setIsButtonDisabled(false);
    }
    getProduct(id).then((product: ProductProps) => {
      setProduct(product);
      console.log(product.price);
      cartDispatch!({
        type: "update",
        payload: {
          id,
          quantity: qty + factor,
          price: (qty + factor) * product.price,
        },
      });
    });
  };

  // const handleSubtract = () => {
  //     cartDispatch!({ type: "update", payload: {id, quantity: qty - 1, price: (qty - 1) * price} });
  // };
  // const handleIncrease = () => {
  //     cartDispatch!({ type: "update", payload: {id, quantity: qty + 1, price: (qty + 1) * price} });
  // };
  const handleDelete = async () => {
    if (user) {
      const response = await axios.put(
        "http://localhost:8000/api/cart",
        { product_id: id, quantity: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        },
      );
      console.log("Item eliminado do carrinho:", response.data);
    }
    else {
      cartDispatch!({
        type: "remove",
        payload: {id, quantity: qty, price: price},
      });
    }
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(Boolean);

  return (
    <>
      <Card className="mt-2">
        <div className="flex flex-column gap-2">
          {/*<span>id: {id}</span>*/}
          <span>{product?.name}</span>
          <span>{price.toFixed(2)}€</span>
          <div className="flex flex-row gap-2">
            <Button
              disabled={isButtonDisabled}
              onClick={() => handleUpdate(-1)}
            >
              -
            </Button>
            <span
              style={{
                fontSize: "20px",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {qty}
            </span>
            <Button onClick={() => handleUpdate(+1)}>+</Button>
            <div className="ml-8">
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
