import React, { useEffect, useState } from "react";
import ApiService, {
  BASE_URL,
  imageHeaders,
  jsonHeaders,
} from "../services/ApiService.ts";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ProductProps } from "./ProductManagement.tsx";


const OrderManageDialog = ({ open, setOpen, action, selectedRow }) => {
  const [visible, setVisible] = useState(false);

  const [order, setOrder] = useState<OrderProps>({});

  const [date, setDate] = useState<Date>("");
  const [orderID, setOrderID] = useState<number>("");
  const [price, setPrice] = useState<number | null>();
  const [stock, setStock] = useState<number | null>();

  const [categoriesDropValues, setCategoriesDropValues] = useState<DropVal[]>(
    [],
  );
  const [typesDropValues, setTypesDropValues] = useState<DropVal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);

  const [selectedType, setSelectedType] = useState(-1);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const [formErrors, setFormErrors] = useState(false);

  const fetchCategoriesValues = async () => {
    const categoriesValues = (await ApiService.get(
      "/categories",
    )) as CategoriesProps[];
    setCategoriesDropValues(
      categoriesValues.map((category) => ({
        label: category.name,
        value: category.id,
      })) as DropVal[],
    );
  };

  const fetchTypesValues = async (category: number) => {
    const typesValues = (await ApiService.get(
      `/types?category=${category}`,
    )) as CategoriesProps[];
    setTypesDropValues(
      typesValues.map((type) => ({
        label: type.name,
        value: type.id,
      })) as DropVal[],
    );
  };

  const fetchType = async () => {
    return (await ApiService.get(
      `/types/${selectedRow?.producttype_id}`,
    )) as TypesProps;
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    (async () => {
      await fetchCategoriesValues();
      if (action === "add") {
        setOrder({});
        clearForm();
      } else if (action === "edit") {
        const type = await fetchType();

        setSelectedCategory(type.productcategory_id);

        await fetchTypesValues(type.productcategory_id);

        setDate(selectedRow!.name!);
        setOrderID(selectedRow!.description!);
        setPrice(selectedRow!.price);
        setStock(selectedRow!.stock);
        setImageToUpload(null);
        setSelectedType(type.id);

        setOrder(selectedRow!);
      }
      setVisible(true);
    })();
    console.log("Initial Effect");
  }, [open]);

  const clearForm = () => {
    setOrder({});
    setDate("");
    setOrderID("");
    setPrice(null);
    setStock(null);
    setSelectedCategory(0);
    setSelectedType(0);
    setImageToUpload(null);
    setFormErrors(false)
  };

  useEffect(() => {
    fetchTypesValues(selectedCategory);
  }, [selectedCategory]);

  const handleSubmit = async () => {
    const validForm =
      !!date &&
      !!orderID &&
      price !== null &&
      stock !== null &&
      ((action === "add" && !!imageToUpload) || action === "edit");
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
      ...(order.id && { id: order.id }),
      name: date,
      description: orderID,
      price: price,
      stock: stock,
      producttype_id: selectedType,
      image_url: imageUrl
        ? imageUrl.filename
        : order?.imageUrl?.split("/").pop(),
    };
    console.log("Request data:", data);
    const response = order.id
      ? await ApiService.put("/products", data, jsonHeaders)
      : await ApiService.post("/products", data, jsonHeaders);

    console.log(response);

    hideDialog();
  };

  const hideDialog = () => {
    setImageToUpload(null);
    setVisible(false);
    setOpen(false);
  };

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
            label="Guardar"
            icon="pi pi-check"
            onClick={handleSubmit}
          />
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
          {order.id && <h2>A editar produto #{order?.id}</h2>}
          {!order.id && <h2>Criar novo produto</h2>}
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-2">
          <div className="field flex flex-column">
            <label htmlFor="name">Nome</label>
            <InputText
              required
              id="name"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field flex flex-column align-items-start">
            <label htmlFor="description">Descrição</label>
            <InputTextarea
              required
              id="description"
              value={orderID}
              style={{
                minWidth: "100%",
                maxWidth: "100%",
                minHeight: "200px",
              }}
              onChange={(e) => setOrderID(e.target.value)}
            />
          </div>
          <div className="field flex flex-column align-items-start">
            <label htmlFor="price">Preço (€)</label>
            <InputNumber
              required
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
              required
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
              required
              id="category"
              value={selectedCategory}
              options={categoriesDropValues}
              onChange={(e) => setSelectedCategory(e.value)}
            />
          </div>
          <div className="field flex flex-column align-items-start">
            <label htmlFor="type">Tipo de produto (Subcategoria)</label>
            <Dropdown
              required
              id="type"
              disabled={selectedCategory < 1}
              value={selectedType}
              options={typesDropValues}
              onChange={(e) => setSelectedType(e.value)}
            />
          </div>
          {order.id && (
            <div className="field flex flex-column align-items-start ">
              Imagem
              <img
                src={`${BASE_URL}/${order.imageUrl}`}
                alt=""
                className="h-12rem m-2"
              />
              {order.imageUrl}
            </div>
          )}
          <div className="field flex flex-column align-items-start">
            {order.id && <label htmlFor="image">Substituir imagem</label>}
            {order.id && <label htmlFor="image">Imagem</label>}
            <FileUpload
              customUpload={true}
              uploadHandler={handleUpload}
              onRemove={() => setImageToUpload(null)}
              auto
              name="image"
              chooseLabel="Escolher..."
              accept="image/*"
              emptyTemplate={<p className="m-0">Arraste a imagem para aqui.</p>}
            />
          </div>
        </div>
      </form>
    </Dialog>
  )
};

export default OrderManageDialog;
