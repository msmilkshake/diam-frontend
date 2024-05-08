import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import ApiService from "../services/ApiService.js";
import { Checkbox } from "primereact/checkbox";
import DiscountManageDialog from "./DiscountManageDialog.tsx";
import { UserProps } from "./UserManagement.tsx";

export interface OrderProps {
  id: number;
  date: Date;
  total: number;
  user_id: number;
}

const OrderPage = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<OrderProps | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getOrders = async () => {
    const orderlist = ((await ApiService.get("/orders")) || []) as OrderProps[];
    setOrders(orderlist);
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
        onSelectionChange={(e) => setSelectedRow(e.value)}
        dataKey="id"
        paginator
        rows={10}
        className="p-datatable-striped"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords} produtos"
      >
        <Column field="id" header="ID" filter sortable></Column>
        <Column
          field="data"
          header="Data de encomenda"
          filter
          sortable
        ></Column>
        <Column field="total" header="Total" filter sortable></Column>
      </DataTable>
      <DiscountManageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        action={action}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default OrderPage;
