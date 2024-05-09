import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ApiService from "../services/ApiService.js";
import OrderDetails from "./OrderDetails.tsx";

export interface OrderProps {
  id: number;
  date: Date;
  total: number;
  user_id: number;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [order, setOrder] = useState<OrderProps | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getOrders = async () => {
    const orderlist = ((await ApiService.get("/orders")) || []) as OrderProps[];
    setOrders(orderlist);
  };

  const handleSelection = (e) => {
    console.log(e.value);
    setOrder(e.value);
    setSelectedRow(null);
    setOpenDialog(true);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <h1>Encomendas</h1>
      <DataTable
        // ref={dt}
        value={orders}
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={(e) => handleSelection(e)}
        dataKey="id"
        paginator
        rows={10}
        className="p-datatable-striped"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords} encomendas"
      >
        <Column field="id" header="ID" filter sortable></Column>
        <Column
          field="date"
          header="Data de encomenda"
          filter
          sortable
        ></Column>
        <Column
          field="total"
          header="Total"
          filter
          sortable
          body={(data) => `${data.total} €`}
        ></Column>
      </DataTable>
      <OrderDetails
        open={openDialog}
        setOpen={setOpenDialog}
        selectedRow={order}
      />
    </>
  );
};

export default OrdersList;
