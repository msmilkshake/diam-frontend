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
import { DiscountProps } from "./DiscountManagement.tsx";
import { Checkbox } from "primereact/checkbox";

type DropVal = {
  label: string;
  value: number;
};

const ProductManageDialog = ({ open, setOpen, action, selectedRow }) => {
  const [visible, setVisible] = useState(false);

  const [discount, setDiscount] = useState<DiscountProps>({});

  const [percent, setPercent] = useState<number | null>();
  const [isActive, setIsActive] = useState<boolean>(false);

  const [productsDropValues, setProductsDropValues] = useState<DropVal[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(-1);

  const [formErrors, setFormErrors] = useState(false);

  const fetchProductsValues = async () => {
    const categoriesValues = (await ApiService.get(
      "/products",
    )) as ProductProps[];
    setProductsDropValues(
      categoriesValues.map((product) => ({
        label: `(id: ${product.id}) ${product.name}`,
        value: product.id,
      })) as DropVal[],
    );
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    (async () => {
      await fetchProductsValues();
      if (action === "add") {
        setDiscount({});
        clearForm();
      } else if (action === "edit") {
        setSelectedProduct(selectedRow!.product_id);
        setPercent(selectedRow!.percent!);
        setIsActive(selectedRow!.is_active);

        setDiscount(selectedRow!);
      }
      setVisible(true);
    })();
    console.log("Initial Effect");
  }, [open]);

  const clearForm = () => {
    setDiscount({});
    setPercent(null);
    setIsActive(false);
    setSelectedProduct(-1);
    setFormErrors(false)
  };

  const handleSubmit = async () => {
    console.log(percent !== null)
    console.log(selectedProduct !== null)
    const validForm = percent !== null && selectedProduct !== null && selectedProduct > 0;
    console.log("Valid form:", validForm);

    if (!validForm) {
      setFormErrors(true);
      return;
    }
    setFormErrors(false);

    const data = {
      ...(discount.id && { id: discount.id }),
      percent: percent,
      product_id: selectedProduct,
      is_active: isActive,
    };
    console.log("Request data:", data);

    const response = discount.id
      ? await ApiService.put("/discounts", data, jsonHeaders)
      : await ApiService.post("/discounts", data, jsonHeaders);

    console.log(response);

    hideDialog();
  };

  const hideDialog = () => {
    setVisible(false);
    setOpen(false);
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
      style={{ width: "34vw" }}
      onHide={hideDialog}
      footer={dialogFooter}
      header={
        <>
          {discount.id && <h2>A editar desconto #{discount?.id}</h2>}
          {!discount.id && <h2>Criar novo desconto</h2>}
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-2">
          <div className="field flex flex-column">
            <label htmlFor="product">Produto associado</label>
            <Dropdown
              filter
              required
              options={productsDropValues}
              id="product"
              value={selectedProduct}
              onChange={(e) => {
                console.log(e);
                setSelectedProduct(e.value);
              }}
            />
          </div>
          <div className="field flex flex-column align-items-start">
            <label htmlFor="percent">
              Percentagem de Desconto (% em decimal)
            </label>
            <InputNumber
              required
              id="percent"
              value={percent}
              minFractionDigits={0}
              maxFractionDigits={2}
              showButtons
              min={0}
              max={100}
              buttonLayout="stacked"
              step={1}
              onValueChange={(e) => {
                console.log(e)
                setPercent(e.value);
              }}
            />
          </div>

          <div className="field flex flex-row align-items-start gap-3">
            <Checkbox
              id="is_active"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <label htmlFor="is_active">Promoção ativa</label>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ProductManageDialog;
