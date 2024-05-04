import { Button } from "primereact/button";
import "primeflex/primeflex.css";
import { InputNumber } from "primereact/inputnumber";
import {useContext, useEffect, useState} from "react";
import { CartContext, CartDispatchContext } from "../contexts/CartContext.ts";
import ApiService from "../services/ApiService.ts";
import {ProductProps} from "./ProductCard.tsx";


const ContactPage = () => {
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0)

  const cart = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);

  const [product, setProduct] = useState<ProductProps>();

  const getProduct = async (id?: number) => {
    return await ApiService.get("/products?id="+ id)
  }

  const addToCart = (id: number) => {
    getProduct(id).then((product: ProductProps) => {
      setProduct(product)
      cartDispatch!({ type: "add", payload: { id, amount: qty, price: product!.price}});
      console.log(id, product!.price)
    })
  };

  useEffect(() => {
    console.log("---LOG--- Cart:", cart)
  }, [cart]);

  return (
    <>
      <div className="flex flex-column gap-2">
        <div>
          {"ID 1: "}
          <InputNumber onChange={(e) => setQty(e.value!)}></InputNumber>
          {/*{"Price"}*/}
          {/*<InputNumber onChange={(e) => setPrice(e.value!)}></InputNumber>*/}
          <Button onClick={() => addToCart(1)}>+</Button>
        </div>
        <div>
          {"ID 2: "}
          <InputNumber onChange={(e) => setQty(e.value!)}></InputNumber>
          <Button onClick={() => addToCart(2)}>+</Button>
        </div>
        <div>
          {"ID 3: "}
          <InputNumber onChange={(e) => setQty(e.value!)}></InputNumber>
          <Button onClick={() => addToCart(3)}>+</Button>
        </div>
        <div>
          {"ID 4: "}
          <InputNumber onChange={(e) => setQty(e.value!)}></InputNumber>
          <Button onClick={() => addToCart(4)}>+</Button>
        </div>
        <div>
          {"ID 5: "}
          <InputNumber onChange={(e) => setQty(e.value!)}></InputNumber>
          <Button onClick={() => addToCart(5)}>+</Button>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
