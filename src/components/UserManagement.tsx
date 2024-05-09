import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import ApiService, { jsonHeaders } from "../services/ApiService.ts";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {Checkbox} from "primereact/checkbox";
import UserManageDialog from "./UserManageDialog.tsx";

export interface UserProps {
  id?: number;
  username?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  addressline1?: string;
  addressline2?: string;
  city?: string;
  country?: string;
  phone?: string;
  VATNumber?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<UserProps | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [action, setAction] = useState<string>("");

  const dt = useRef(null);

  useEffect(() => {
    reloadData();
  }, [openDialog]);

  const reloadData = async () => {
    const users = (await ApiService.get("/admin/users")) as UserProps[];
    console.log(users);
    setUsers(users);
  }

  useEffect(() => {
    console.log("Selected Row", selectedRow)
  }, [selectedRow]);


  const handleEdit = async () => {
    console.log("edit clicked");
    setAction("edit");
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    await ApiService.delete(`/admin/users/${selectedRow?.id}`, jsonHeaders);
    reloadData()
  };

  const handleClearFilters = () => {
    dt.current.reset();
  };

  const footer = (
    <div className="p-clearfix flex flex-row gap-2 w-full">
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
      <h1>Gestão de Utilizadores</h1>
      <DataTable
        ref={dt}
        value={users}
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={(e) => setSelectedRow(e.value)}
        dataKey="id"
        paginator
        rows={10}
        className="p-datatable-striped"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords} utilizadores"
        footer={footer}
      >
        <Column
          field="id"
          header="ID"
          filter
          sortable
        ></Column>
        <Column
          field="username"
          header="Nome de utilizador"
          filter
          sortable
        ></Column>
        <Column
          field="email"
          header="Email"
          filter
          sortable
        ></Column>
        <Column
            field="city"
            header="Cidade"
            filter
            sortable
        ></Column>
        <Column
            field="country"
            header="País"
            filter
            sortable
        ></Column>
        <Column
            field="phone"
            header="Telemóvel"
            filter
            sortable
        ></Column>
        <Column
          field="is_staff"
          header="Staff"
          body={(data) => <Checkbox readOnly={true} checked={data.is_staff}/>}
          filter
          filterType="number"
          sortable
        ></Column>
        <Column
          field="is_superuser"
          header="Superuser"
          body={(data) => <Checkbox readOnly={true} checked={data.is_superuser}/>}
          filter
          filterType="number"
          sortable
        ></Column>
        <Column
          field="is_active"
          header="Ativo"
          body={(data) => <Checkbox readOnly={true} checked={data.is_active}/>}
          filter
          sortable
        ></Column>
      </DataTable>
      <UserManageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        action={action}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default UserManagement