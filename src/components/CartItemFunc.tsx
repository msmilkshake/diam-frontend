import { useContext, useEffect, useReducer, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {CartContext, CartDispatchContext, CartItem} from "../contexts/CartContext.ts";
import { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";
import { LoginContext, loginReducer } from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";


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
    const cart = (await ApiService.get("/cart") ||
        []) as CartItem[];
    cartDispatch!({
      type: "restore",
      payload: cart,
    });
  }
  
  const handleUpdate = (factor: number) => {
    if (qty + factor === 1) {
      setIsButtonDisabled(true);
    } else if (qty + factor === 2) {
      setIsButtonDisabled(false);
    }
    if (user){
      axiosRequest(factor);
    }
    else {
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
        });
      });
    }
  };

  const handleDelete = async () => {
    if (user) {
      await axiosRequest(0);
    }
    else {
      cartDispatch!({
        type: "remove",
        payload: {id, quantity: qty, price: price},
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
      console.log("Item eliminado do carrinho:", response.data);
    } else {
      response = await axios.post(url, data, config);
      console.log("Item atualizado no carrinho:", response.data);
    }
    getDbCart();
  };

  return (
    <>
      <Card className="mt-2">
        <div className="flex flex-column gap-2">
          {/*<span>id: {id}</span>*/}
          <span>{product?.name}</span>
          <span>{(price*qty).toFixed(2)}€</span>
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

export default CartItemFunc;
