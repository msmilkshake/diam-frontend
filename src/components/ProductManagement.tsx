import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import ApiService, { jsonHeaders } from "../services/ApiService.ts";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ProductManageDialog from "./ProductManageDialog.tsx";

export interface ProductProps {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
  stock?: number;
  price?: number;
  rating?: number;
  discountPrice?: number;
  discountPercent?: number;
  producttype_id?: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<ProductProps | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [action, setAction] = useState<string>("");

  const dt = useRef(null);

  useEffect(() => {
    reloadData();
  }, [openDialog]);

  const reloadData = async () => {
    const products = (await ApiService.get("/products")) as ProductProps[];
    console.log(products);
    setProducts(products);
  }

  const longTextTemplate = (rowData, field) => {
    return (
      <div
        style={{
          maxWidth: "240px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {rowData[field]}
      </div>
    );
  };

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
    await ApiService.delete(`/products/${selectedRow?.id}`, jsonHeaders);
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
        tooltip="Criar novo produto"
      />
      <Button
        rounded
        icon="pi pi-pencil"
        onClick={handleEdit}
        disabled={!selectedRow}
        tooltip="Editar produto selecionado"
      />
      <Button
        rounded
        icon="pi pi-trash"
        onClick={handleDelete}
        disabled={!selectedRow}
        tooltip="Apagar produto selecionado"
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
      <h1>Gestão de Produtos</h1>
      <DataTable
        ref={dt}
        value={products}
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
        <Column field="id" header="ID" filter sortable></Column>
        <Column
          field="name"
          header="Nome"
          body={(data) => longTextTemplate(data, "name")}
          filter
          sortable
        ></Column>
        <Column
          field="description"
          header="Descrição"
          body={(data) => longTextTemplate(data, "description")}
          filter
          sortable
        ></Column>
        <Column field="price" header="Preço" filter sortable></Column>
        <Column
          field="stock"
          header="Quantidade Stock"
          filter
          sortable
        ></Column>
        <Column field="rating" header="Avaliação" filter sortable></Column>
        <Column
          field="discountPercent"
          header="% Desconto"
          filter
          filterType="number"
          sortable
        ></Column>
        <Column
          field="discountPrice"
          header="Preço Desconto"
          filter
          sortable
        ></Column>
      </DataTable>
      <ProductManageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        action={action}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default ProductManagement