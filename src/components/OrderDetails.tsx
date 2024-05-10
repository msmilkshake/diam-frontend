import React, { useEffect, useState } from "react";
import ApiService, { BASE_URL } from "../services/ApiService.ts";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { OrderProps } from "./OrdersList.tsx";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  imageUrl: string;
  price: number;
}

const OrderDetails = ({ open, setOpen, selectedRow }) => {
  const [visible, setVisible] = useState(false);

  const [order, setOrder] = useState<OrderProps>();
  const [items, setItems] = useState<OrderItem[]>([]);

  const getProducts = async () => {
    console.log("SOU A ROW: ", selectedRow.id);
    return (await ApiService.get(`/orders/${selectedRow?.id}`)) as OrderItem[];
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    // (async () => {
    //   await getProducts();
    // })();
    getProducts().then((products: OrderItem[]) => {
      setItems(products);
    });
    setOrder(selectedRow!);
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

  const itemTemplate = (item) => {
    console.log("ITEM:", item);
    return (
      <div className="flex flex-row justify-content-between align-items-center">
        <div className="flex flex-row gap-4 align-items-center">
          <img
            src={`${BASE_URL}/${item.image_url}`}
            alt=""
            className="w-5rem h-5rem "
          />
          <div className="flex flex-column gap-2">
            <strong style={{ fontSize: "1.2rem" }}>
              <Link to={`/products/${item?.product_id}`}>{item?.name}</Link>
            </strong>
            <span>Preço: {item.price.toFixed(2)} €</span>
          </div>
        </div>
        <div className="flex flex-column align-items-end gap-2">
          <span>Quantidade:</span>
          <strong style={{ fontSize: "1.1rem", marginRight: "0.5rem" }}>
            {item.quantity}
          </strong>
        </div>
        <div className="flex flex-column align-items-end gap-2">
          <span>Subtotal:</span>
          <strong style={{ fontSize: "1.1rem", marginRight: "0.5rem" }}>
            {(item.quantity * item.price).toFixed(2)} €
          </strong>
        </div>
      </div>
    );
  };

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
              <div className="flex flex-column gap-3">
              <div>Data da encomenda: {selectedRow.date}</div>
              <div className="text-right">Total: {selectedRow.total}€</div>
              </div>
            </div>
          )}
        </>
      }
    >

      <DataTable value={items} >
        <Column field="item" header={"Artigos encomendados"} body={itemTemplate}></Column>
      </DataTable></Dialog>
  );
};
export default OrderDetails;
