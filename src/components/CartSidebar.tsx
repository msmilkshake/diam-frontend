import { Sidebar } from "primereact/sidebar";
import {useContext, useEffect, useState} from "react";
import "primeflex/primeflex.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { CartContext, CartDispatchContext } from "../contexts/CartContext.ts";
import { ProductProps } from "./ProductCard.tsx";
import ApiService from "../services/ApiService.ts";

const CartSidebar = ({ visible, setVisible }) => {
  const cartItems = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const handleClear = () => {
    cartDispatch!({ type: "clear", payload: [] });
  };

  const [product, setProduct] = useState<ProductProps>();

  const getProduct = async (id?: number) => {
    return await ApiService.get("/products?id=" + id);
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
                id={item.id}
                qty={item.amount}
                price={item.price}
              ></CartItem>
            ))}
          {cartItems?.length === 0 && <span>empty cart</span>}
        </div>
        <div>
          <Button onClick={handleClear}>Clear</Button>
        </div>
      </Sidebar>
    </>
  );
};

export default CartSidebar;

const CartItem = ({ id, qty, price }) => {
  const cartDispatch = useContext(CartDispatchContext);
  const [product, setProduct] = useState<ProductProps>();

  const getProduct = async (id?: number) => {
    // console.log(id)
    return await ApiService.get("/products?id=" + id);
  };

  useEffect(() => {
    getProduct(id).then((product: ProductProps) => {
      setProduct(product);
    })
  }, []);

  const handleUpdate = (factor: number) => {
    if ((qty + factor) === 0 ){
      handleDelete()
      return
    }
    getProduct(id).then((product: ProductProps) => {
      setProduct(product);
      console.log(product.price);
      cartDispatch!({
        type: "update",
        payload: {
          id,
          amount: qty + factor,
          price: (qty + factor) * product.price,
        },
      });
    });
  };

  // const handleSubtract = () => {
  //     cartDispatch!({ type: "update", payload: {id, amount: qty - 1, price: (qty - 1) * price} });
  // };
  // const handleIncrease = () => {
  //     cartDispatch!({ type: "update", payload: {id, amount: qty + 1, price: (qty + 1) * price} });
  // };
  const handleDelete = () => {
    cartDispatch!({ type: "remove", payload: {id, amount: qty, price: price} });
  };

  return (
    <>
      <Card>
        <div className="flex flex-column gap-2">
          <span>id: {id}</span>
          <span>nome: {product?.name}</span>
          <span>amount: {qty}</span>
          <span>price: {price}</span>
          <div className="flex flex-row gap-2">
            <Button onClick={() => handleUpdate(-1)}>-</Button>
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
