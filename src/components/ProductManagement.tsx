import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService.ts";
import { ProductProps } from "./ProductCard.tsx";
import { Column } from "primereact/column";

export const ProductManagement = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const products = await ApiService.get("/products");
      setProducts(products);
      setProductsLoading(false);
    };
    fetchData();
  }, []);

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.imageUrl}
        alt={rowData.name}
        className="product-image"
      />
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <div
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {rowData.description}
      </div>
    );
  };

  return productsLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      <DataTable
        value={products}
        paginator
        rows={10}
        className="p-datatable-striped"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <Column field="id" header="ID" filter sortable></Column>
        <Column field="name" header="Name" filter sortable></Column>
        <Column
          field="description"
          header="Description"
          body={descriptionBodyTemplate}
          filter
          sortable
        ></Column>
        <Column field="price" header="Price" filter sortable></Column>
        <Column field="rating" header="Rating" filter sortable></Column>
        <Column
          field="discountPrice"
          header="Discount Price"
          filter
          sortable
        ></Column>
        <Column
          field="discountPercent"
          header="Discount Percent"
          filter
          sortable
        ></Column>
      </DataTable>
    </>
  );
};
