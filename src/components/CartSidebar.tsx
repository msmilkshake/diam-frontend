import { Sidebar } from "primereact/sidebar";
import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import {
  CartContext,
  CartDispatchContext,
  CartItem,
} from "../contexts/CartContext.ts";
import ApiService from "../services/ApiService.ts";
import CartItemFunc from "./CartItemFunc.tsx";
import { LoginContext } from "../contexts/LoginContext.ts";
import axios from "axios";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {ToastContext} from "../contexts/ToastContext.ts";

const CartSidebar = ({ visible, setVisible, setLoginVisible }) => {
  const cartItems = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const user = useContext(LoginContext);
  const [total, setTotal] = useState();
  const showToast = useContext(ToastContext);

  useEffect(() => {
    getDbCart();
  }, [user]);
  useEffect(() => {
    let totalprice = 0;
    for (const item of cartItems!) {
      totalprice += (item.discountPrice || item.price) * item.quantity;
      // console.log(total);
    }
    setTotal(totalprice.toFixed(2));
  }, [cartItems]);

  const getDbCart = async () => {
    const cart = ((await ApiService.get("/cart")) || []) as CartItem[];
    cartDispatch!({
      type: "restore",
      payload: cart,
    });
    // console.log(cart)
  };

  const handleClear = () => {
    if (user) {
      axios.delete("http://localhost:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
      getDbCart();
    } else {
      cartDispatch!({ type: "clear", payload: [] });
    }
  };
  const handlePurchase = async () => {
    if (user) {
      const response = await axios.post(
        "http://localhost:8000/api/orders",
        {},
        {
          validateStatus: () => true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        },
      );
      if (response.status === 202) {
        showToast!("warn", "Sem stock", "O produto " + response.data.name + " apenas tem " + response.data.stock + " itens em stock!");
        // console.log(response.data);
      }
      if (response.status === 200){
        showToast!("success", "Encomenda criada", response.data.details);
      }
      getDbCart();
    } else {
      handleClear();
    }
  };
  const dataTemplate = (item) => {
    return (
      <CartItemFunc
        key={item.id}
        id={item.id}
        qty={item.quantity}
        price={item.discountPrice || item.price}
      ></CartItemFunc>
    );
  };

  const showLogin = () => {
    setVisible(false);
    setLoginVisible(true);
  };

  return (
    <>
      <Sidebar
        position={"right"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "500px", background: "#374151" }}
        header="Carrinho de Compras"
      >
        <div>
          <DataTable
            value={cartItems}
            emptyMessage={<span>Carrinho vazio!</span>}
            footer={
              <div className="flex flex-column gap-3">
                <div>{cartItems?.length !== 0 && <h3>Total: {total}€</h3>}</div>
                {cartItems?.length > 0 && (
                  <div className="flex flex-row justify-content-between gap-3">
                    <Button onClick={handleClear}>Limpar carrinho</Button>
                    {user && (
                      <Button onClick={handlePurchase}>
                        Finalizar Encomenda
                      </Button>
                    )}
                    {!user && (
                      <Button onClick={showLogin}>
                        Inicie sessão para encomendar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            }
          >
            <Column
              field="item"
              header="Produtos no carrinho"
              body={dataTemplate}
            />
          </DataTable>
        </div>
      </Sidebar>
    </>
  );
};

export default CartSidebar;
