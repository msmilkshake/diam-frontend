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
import { UserProps } from "./UserManagement.tsx";

type DropVal = {
  label: string;
  value: number;
};

const countriesDropValues: DropVal[] = [
  {
    label: "Portugal",
    value: "Portugal",
  },
  {
    label: "Espanha",
    value: "Espanha",
  },
];

const UserManageDialog = ({ open, setOpen, action, selectedRow }) => {
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState<UserProps>({});

  const [email, setEmail] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [vatNumber, setVatNumber] = useState<string>("");

  const [isStaff, setIsStaff] = useState<boolean>("");
  const [isSuperuser, setIsSuperuser] = useState<boolean>("");
  const [isActive, setIsActive] = useState<boolean>(false);

  const [selectedCountry, setSelectedCountry] = useState<string>(
    countriesDropValues[0].value,
  );

  const [formErrors, setFormErrors] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    (async () => {
      if (action === "edit") {
        setEmail(selectedRow!.email);
        setIsStaff(selectedRow!.is_staff);
        setIsSuperuser(selectedRow!.is_superuser);
        setIsActive(selectedRow!.is_active);
        setAddressLine1(selectedRow!.addressline1);
        setAddressLine2(selectedRow!.addressline2);
        setCity(selectedRow!.city);
        setSelectedCountry(selectedRow!.country);
        setPhone(selectedRow!.phone);
        setVatNumber(selectedRow!.VATNumber);

        setUser(selectedRow!);
      }
      setVisible(true);
    })();
    console.log("Initial Effect");
  }, [open]);

  const clearForm = () => {
    setUser({});
    setEmail("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setPhone("");
    setVatNumber("");
    setFormErrors(false);
  };

  const handleSubmit = async () => {
    const validForm = email !== "";
    console.log("Valid form:", validForm);

    if (!validForm) {
      setFormErrors(true);
      return;
    }
    setFormErrors(false);

    const data: UserProps = {
      id: user.id,
      username: user.username,
      email: email,
      is_staff: isStaff,
      is_superuser: isSuperuser,
      is_active: isActive,
      addressline1: addressLine1,
      addressline2: addressLine2,
      city: city,
      country: selectedCountry,
      phone: phone,
      VATNumber: vatNumber,
    };
    console.log("Request data:", data);

    const response = await ApiService.put(`/admin/users`, data, jsonHeaders);

    console.log(response);

    hideDialog();
  };

  const hideDialog = () => {
    setVisible(false);
    setOpen(false);
    clearForm()
  };

  const dialogFooter = (
    <div className="ui-dialog-buttonpane p-clearfix">
      <div className="flex flex-row justify-content-between w-100">
        {formErrors && (
          <span style={{ color: "indianred", marginTop: "0.5rem" }}>
            O campo Email é obrigatório.
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
          {user.id && (
            <h2>
              A editar utilizador #{user?.id} - {user?.username}
            </h2>
          )}
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-2">
          <div className="field flex flex-column">
            <label htmlFor="email">Email</label>
            <InputText
              required
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="addressline1">Linha de endereço 1</label>
            <InputText
              required
              id="addressline1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="addressline2">Linha de endereço 2</label>
            <InputText
              required
              id="addressline2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="city">Cidade</label>
            <InputText
              required
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="country">País</label>
            <Dropdown
              filter
              required
              options={countriesDropValues}
              id="product"
              value={selectedCountry}
              onChange={(e) => {
                console.log(e);
                setSelectedCountry(e.value);
              }}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="phone">Telemóvel</label>
            <InputText
              required
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field flex flex-column">
            <label htmlFor="VATNumber">Contribuinte</label>
            <InputText
              required
              id="VATNumber"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
            />
          </div>
          <div className="field flex flex-row align-items-start gap-3">
            <Checkbox
              id="is_staff"
              checked={isStaff}
              onChange={() => setIsStaff(!isStaff)}
            />
            <label htmlFor="is_staff">Staff</label>
          </div>
          <div className="field flex flex-row align-items-start gap-3">
            <Checkbox
              id="is_superuser"
              checked={isSuperuser}
              onChange={() => setIsSuperuser(!isSuperuser)}
            />
            <label htmlFor="is_superuser">Superuser</label>
          </div>
          <div className="field flex flex-row align-items-start gap-3">
            <Checkbox
              id="is_active"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <label htmlFor="is_active">Ativo</label>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default UserManageDialog;
