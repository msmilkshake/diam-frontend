import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { CartDispatchContext, CartItem } from "../contexts/CartContext.ts";
import { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";
import { LoginContext } from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const CartItemFunc = ({ id, qty, price }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(Boolean);
  const cartDispatch = useContext(CartDispatchContext);
  const [product, setProduct] = useState<ProductProps>();
  const user = useContext(LoginContext);

  useEffect(() => {
    getProduct(id).then((product: ProductProps) => {
      setProduct(product);
    });
    if (qty === 1) {
      setIsButtonDisabled(true);
    }
  }, []);

  const getProduct = async (id?: number) => {
    // console.log(id)
    return await ApiService.get(`/products/${id}`);
  };

  const getDbCart = async () => {
    console.log("[CartItemFunc.tsx getDbCart]");
    const cart = ((await ApiService.get("/cart")) || []) as CartItem[];
    cartDispatch!({
      type: "restore",
      payload: cart,
      user: "loggedin",
    });
  };

  const handleUpdate = (factor: number) => {
    if (qty + factor === 1) {
      setIsButtonDisabled(true);
    } else if (qty + factor === 2) {
      setIsButtonDisabled(false);
    }
    if (user) {
      axiosRequest(factor);
    } else {
      getProduct(id).then((product: ProductProps) => {
        setProduct(product);
        console.log(product.price);
        cartDispatch!({
          type: "update",
          payload: {
            id,
            quantity: qty + factor,
            price: product.price,
          },
          user: user ? "loggedin" : "anonymous",
        });
      });
    }
  };

  const handleDelete = async () => {
    if (user) {
      await axiosRequest(0);
    } else {
      cartDispatch!({
        type: "remove",
        payload: { id, quantity: qty, price: price },
        user: user ? "loggedin" : "anonymous",
      });
    }
  };

  const axiosRequest = async (amount: number) => {
    const url = "http://localhost:8000/api/cart";
    const data = { product_id: id, quantity: amount };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    let response = null;
    if (amount === 0) {
      response = await axios.put(url, data, config);
      // console.log("Item eliminado do carrinho:", response.data);
    } else {
      response = await axios.post(url, data, config);
      // console.log("Item atualizado no carrinho:", response.data);
    }
    console.log(response);
    getDbCart();
  };

  return (
    <>
      <div className="flex flex-column gap-2">
        {/*<span>id: {id}</span>*/}
        <span>
          <Link to={`/products/${product?.id}`}>{product?.name}</Link>
        </span>
        <span>{(price * qty).toFixed(2)}€</span>
        <div className="flex flex-row">
          <div className="flex-grow-1 flex flex-row gap-2">
            <Button
              icon="pi pi-minus"
              rounded
              disabled={isButtonDisabled}
              onClick={() => handleUpdate(-1)}
            />
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
            <Button
              icon="pi pi-plus"
              rounded
              onClick={() => handleUpdate(+1)}
            />
          </div>
          <Button icon="pi pi-trash" onClick={handleDelete}></Button>
        </div>
      </div>
    </>
  );
};

export default CartItemFunc;
