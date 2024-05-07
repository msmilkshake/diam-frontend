import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import ApiService, {imageHeaders, BASE_URL, jsonHeaders} from "../services/ApiService.ts";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import Cookies from "js-cookie";

interface ProductProps {
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
  const [product, setProduct] = useState<ProductProps>({});

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | null>();
  const [stock, setStock] = useState<number | null>();

  const [catsDropValues, setCatsDropValues] = useState<DropVal[]>([]);
  const [typesDropValues, setTypesDropValues] = useState<DropVal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);

  const [selectedType, setSelectedType] = useState(-1);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const [formErrors, setFormErrors] = useState(false);

  const dt = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const products = (await ApiService.get("/products")) as ProductProps[];
      console.log(products);
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

  const clearForm = () => {
    setProduct({});
    setName("");
    setDescription("");
    setPrice(null);
    setStock(null);
    setSelectedCategory(0);
    setSelectedType(0);
    setImageToUpload(null);
  };

  const handleAdd = () => {
    console.log("add clicked");
    setProduct({});
    clearForm();
    setDialogVisible(true);
    console.log("add clicked");
  };

  const handleEdit = async () => {
    console.log("edit clicked");

    const type = (await ApiService.get(
      `/types/${selectedRow?.producttype_id}`,
    )) as TypesProps;

    setSelectedCategory(type.productcategory_id);

    await getTypesValues(type.productcategory_id);

    setName(selectedRow!.name!);
    setDescription(selectedRow!.description!);
    setPrice(selectedRow?.price);
    setStock(selectedRow?.stock);
    setImageToUpload(null);
    setSelectedType(type.id);

    setProduct(selectedRow!);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    await ApiService.delete(
        `/products/${selectedRow?.id}`,
        jsonHeaders)
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

  const handleSubmit = async () => {
    const validForm =
      !!name &&
      !!description &&
      price !== null &&
      stock !== null &&
      !!selectedType &&
      (!!imageToUpload || !!selectedRow);
    console.log("Valid form:", validForm);
    if (!validForm) {
      setFormErrors(true);
      return;
    }
    setFormErrors(false);
    let imageUrl = null;
    if (imageToUpload) {
      imageUrl = await uploadFile();
    }

    const data = {
      ...(product.id && { id: product.id }),
      name: name,
      description: description,
      price: price,
      stock: stock,
      producttype_id: selectedType,
      image_url: imageUrl
        ? imageUrl.filename
        : product?.imageUrl?.split("/").pop(),
    };
    const response = product.id
      ? await ApiService.put("/products", data, jsonHeaders)
      : await ApiService.post("/products", data, jsonHeaders);

    console.log(response)

    hideDialog();
  };

  const hideDialog = () => {
    setImageToUpload(null);
    setDialogVisible(false);
  };

  const dialogFooter = (
    <div className="ui-dialog-buttonpane p-clearfix">
      <div className="flex flex-row justify-content-between w-100">
        {formErrors && (
          <span style={{ color: "indianred", marginTop: "0.5rem" }}>
            Todos os campos são obrigatórios.
          </span>
        )}
        <div className="flex-grow-1">
          <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} />
          <Button
            type="submit"
            label="Salvar"
            icon="pi pi-check"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );

  const handleUpload = (event: FileUploadHandlerEvent) => {
    setImageToUpload(event.files[0]);
    console.log("Upload File is set!", event.files[0]);
    console.log(event);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("image", imageToUpload!, imageToUpload!.name);
    console.log(formData);
    return await ApiService.post("/upload", formData, imageHeaders);
  };

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
        style={{ width: "44vw" }}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        {product.id && <h2>A editar produto #{product?.id}</h2>}
        {!product.id && <h2>Adicionar novo produto</h2>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column gap-2">
            <div className="field flex flex-column">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="description">Descrição</label>
              <InputTextarea
                id="description"
                value={description}
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  minHeight: "200px",
                }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="price">Preço (€)</label>
              <InputNumber
                id="price"
                value={price}
                minFractionDigits={0}
                maxFractionDigits={2}
                showButtons
                min={0}
                buttonLayout="stacked"
                step={0.1}
                onValueChange={(e) => setPrice(e.value)}
              />
            </div>
            <div className="field flex flex-column align-items-start">
              <label htmlFor="price">Stock (Unid.)</label>
              <InputNumber
                id="stock"
                value={stock}
                showButtons
                buttonLayout="stacked"
                min={0}
                step={1}
                onValueChange={(e) => setStock(e.value)}
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
                disabled={selectedCategory < 1}
                value={selectedType}
                options={typesDropValues}
                onChange={(e) => setSelectedType(e.value)}
              />
            </div>
            {product.id && (
              <div className="field flex flex-column align-items-start ">
                Imagem
                <img
                  src={`${BASE_URL}/${product.imageUrl}`}
                  alt=""
                  className="h-12rem m-2"
                />
                {product.imageUrl}
              </div>
            )}
            <div className="field flex flex-column align-items-start">
              {product.id && <label htmlFor="image">Substituir imagem</label>}
              {!product.id && <label htmlFor="image">Imagem</label>}
              <FileUpload
                customUpload={true}
                uploadHandler={handleUpload}
                onRemove={() => setImageToUpload(null)}
                auto
                name="image"
                // mode="basic"
                chooseLabel="Escolher..."
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
