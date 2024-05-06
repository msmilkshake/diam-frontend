import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import ApiService from "../services/ApiService.ts";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

interface ProductProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  stock: number;
  price: number;
  rating: number;
  discountPrice?: number;
  discountPercent?: number;
  producttype_id: number;
}

interface CategoriesProps {
  id: number;
  name: string;
}

interface TypesProps {
  id: number;
  name: string;
  productcategory_id: number;
}

type DropVal = {
  label: string;
  value: number;
};

export const ProductManagement = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<ProductProps | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [product, setProduct] = useState<ProductProps | null>();
  const [catsDropValues, setCatsDropValues] = useState<DropVal[]>([]);
  const [typesDropValues, setTypesDropValues] = useState<DropVal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [selectedType, setSelectedType] = useState(-1);

  const dt = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const products = (await ApiService.get("/products")) as ProductProps[];
      const categoriesValues = (await ApiService.get(
        "/categories",
      )) as CategoriesProps[];
      setProducts(products);
      setCatsDropValues(
        categoriesValues.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      );
    };

    fetchData();
  }, []);

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

  const getTypesValues = async (category: number) => {
    const typesValues = (await ApiService.get(
      `/types?category=${category}`,
    )) as CategoriesProps[];
    setTypesDropValues(
      typesValues.map((type) => ({
        label: type.name,
        value: type.id,
      })),
    );
  };

  useEffect(() => {
    getTypesValues(selectedCategory);
  }, [selectedCategory]);

  const handleAdd = () => {
    // handle add here.
    console.log("add clicked");
  };

  const handleEdit = async () => {
    // handle edit here.
    console.log("edit clicked");

    const type = (await ApiService.get(
      `/types/${selectedRow?.producttype_id}`,
    )) as TypesProps;

    setSelectedCategory(type.productcategory_id);

    await getTypesValues(type.productcategory_id);

    setSelectedType(type.id);
    setProduct(selectedRow);
    setDialogVisible(true);
  };

  const handleDelete = () => {
    // handle delete here.
    console.log("delete clicked");
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
        tooltip="Adicionar novo produto"
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

  const getSelectedRow = (event) => {
    setSelectedRow(event.value);
  };

  const handleSubmit = () => {
    console.log(product);
    hideDialog();
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const dialogFooter = (
    <div className="ui-dialog-buttonpane p-clearfix">
      <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} />
      <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit} />
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
        onSelectionChange={(e) => getSelectedRow(e)}
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
      <Dialog
        visible={dialogVisible}
        style={{ width: "40vw" }}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <h2>A editar produto #{product?.id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column gap-2">
            <div className="field flex flex-column">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={product?.name}
                onChange={(e) =>
                  // @ts-expect-error types
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="description">Descrição</label>
              <InputTextarea
                id="description"
                value={product?.description}
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  minHeight: "200px",
                }}
                onChange={(e) =>
                  // @ts-expect-error types
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="price">Preço (€)</label>
              <InputNumber
                id="price"
                value={product?.price}
                minFractionDigits={0}
                maxFractionDigits={2}
                showButtons
                buttonLayout="stacked"
                step={0.1}
                onValueChange={(e) =>
                  // @ts-expect-error types
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    price: e.value,
                  }))
                }
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="price">Stock (Unid.)</label>
              <InputNumber
                id="price"
                value={product?.stock}
                showButtons
                buttonLayout="stacked"
                step={1}
                onValueChange={(e) =>
                  // @ts-expect-error types
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    price: e.value,
                  }))
                }
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="category">Categoria de produto</label>
              <Dropdown
                id="category"
                value={selectedCategory}
                options={catsDropValues}
                onChange={(e) => setSelectedCategory(e.value)}
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="type">Tipo de produto (Subcategoria)</label>
              <Dropdown
                id="type"
                value={selectedType}
                options={typesDropValues}
                onChange={(e) => setSelectedType(e.value)}
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="image">Tipo de produto (Subcategoria)</label>
              <FileUpload
                name="image"
                url={"/api/upload"}
                auto={false}
                chooseLabel="Escolher..."
                uploadLabel="Carregar"
                cancelLabel="Limpar"
                accept="image/*"
                emptyTemplate={
                  <p className="m-0">Arraste a imagem para aqui.</p>
                }
              />
            </div>
            {/* And other fields for your product.. */}
          </div>
        </form>
      </Dialog>
    </>
  );
};
