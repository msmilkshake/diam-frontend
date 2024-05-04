import { Button } from "primereact/button";
import "primeflex/primeflex.css";
import { InputNumber } from "primereact/inputnumber";
import {useContext, useEffect, useState} from "react";
import { CartContext, CartDispatchContext } from "../contexts/CartContext.ts";

const ContactPage = () => {
  const [qty, setQty] = useState(0);

  const cart = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);

  const addToCart = (id: number) => {
    cartDispatch!({ type: "add", payload: { id, amount: qty } });
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
