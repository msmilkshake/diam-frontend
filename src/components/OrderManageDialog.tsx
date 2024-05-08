import React, { Fragment, useEffect, useState } from "react";
import ApiService from "../services/ApiService.ts";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { OrderProps } from "./OrderPage.tsx";
import { ProductProps } from "./ProductCard.tsx";
import { Link } from "react-router-dom";

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  imageUrl: string;
  price: number;
}

const OrderManageDialog = ({ open, setOpen, selectedRow }) => {
  const [visible, setVisible] = useState(false);

  const [order, setOrder] = useState<OrderProps>();
  const [items, setItems] = useState<OrderItem[]>([]);

  const getProducts = async () => {
    console.log("SOU A ROW: ",selectedRow.id)
    return (await ApiService.get(
      `/orders/${selectedRow?.id}`,
    )) as OrderItem[];
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    // (async () => {
    //   await getProducts();
    // })();
   getProducts().then((products: OrderItem[]) => {
     setItems(products)
   });
    setOrder(selectedRow!);
    // console.log(items);
    setVisible(true);
  }, [open]);

  const hideDialog = () => {
    setVisible(false);
    setOpen(false);
  };

  const dialogFooter = (
    <div className="ui-dialog-buttonpane p-clearfix">
      <div className="flex flex-row justify-content-between w-100">
        <div className="flex-grow-1">
          <Button label="Fechar" icon="pi pi-times" onClick={hideDialog} />
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "44vw" }}
      onHide={hideDialog}
      footer={dialogFooter}
      header={
        <>
          {selectedRow && (
            <div>
              <h2>Encomenda #{order?.id}</h2>
              <div>Data: {selectedRow.date}</div>
              <div>Total: {selectedRow.total}€</div>
              {items &&
                items.map((item) => (
                  <div key={item.product_id}>
                    <div className="flex flex-column gap-2">
                      {/*<span>id: {id}</span>*/}
                      <span>
                        <Link to={`/products/${item?.product_id}`}>
                          {item?.name}
                        </Link>
                      </span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      }
    ></Dialog>
  );
};
export default OrderManageDialog;
