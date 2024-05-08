import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import ApiService, { jsonHeaders } from "../services/ApiService.ts";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {Checkbox} from "primereact/checkbox";
import DiscountManageDialog from "./DiscountManageDialog.tsx";

export interface DiscountProps {
  id?: number;
  percent?: number;
  product_id?: number;
  is_active?: boolean;
  product_name?: string;
}

export const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState<DiscountProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<DiscountProps | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [action, setAction] = useState<string>("");

  const dt = useRef(null);

  useEffect(() => {
    reloadData();
  }, [openDialog]);

  const reloadData = async () => {
    const products = (await ApiService.get("/discounts")) as DiscountProps[];
    console.log(products);
    setDiscounts(products);
  }

  useEffect(() => {
    console.log("Selected Row", selectedRow)
  }, [selectedRow]);


  const handleAdd = () => {
    console.log("add clicked");
    setAction("add");
    setOpenDialog(true);
  };

  const handleEdit = async () => {
    console.log("edit clicked");
    setAction("edit");
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    await ApiService.delete(`/discounts/${selectedRow?.id}`, jsonHeaders);
    reloadData()
  };

  const handleClearFilters = () => {
    dt.current.reset();
  };

  const footer = (
    <div className="p-clearfix flex flex-row gap-2 w-full">
      <Button
        rounded
        icon="pi pi-plus"
        onClick={handleAdd}
        tooltip="Criar novo desconto"
      />
      <Button
        rounded
        icon="pi pi-pencil"
        onClick={handleEdit}
        disabled={!selectedRow}
        tooltip="Editar desconto selecionado"
      />
      <Button
        rounded
        icon="pi pi-trash"
        onClick={handleDelete}
        disabled={!selectedRow}
        tooltip="Apagar desconto selecionado"
      />
      <Button
        rounded
        icon="pi pi-filter-slash"
        onClick={handleClearFilters}
        tooltip="Limpar filtros"
      />
    </div>
  );

  return (
    <>
      <h1>Gestão de Descontos</h1>
      <DataTable
        ref={dt}
        value={discounts}
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={(e) => setSelectedRow(e.value)}
        dataKey="id"
        paginator
        rows={10}
        className="p-datatable-striped"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords} produtos"
        footer={footer}
      >
        <Column
          field="id"
          header="ID"
          filter
          sortable
        ></Column>
        <Column
          field="product_id"
          header="ID Produto"
          filter
          sortable
        ></Column>
        <Column
          field="product_name"
          header="Nome do Produto"
          filter
          sortable
        ></Column>
        <Column
          field="percent"
          header="% Desconto"
          filter
          filterType="number"
          sortable
        ></Column>
        <Column
          field="is_active"
          header="Promoção ativa"
          body={(data) => <Checkbox readOnly={true} checked={data.is_active}/>}
          filter
          sortable
        ></Column>
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

export default DiscountManagement