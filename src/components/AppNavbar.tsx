import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import React, { useState } from "react";
import UserButtons from "./UserButtons.tsx";
import "primeflex/primeflex.css";

const AppNavbar = ({ setVisible, setCartSidebarVisible}) => {
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Products",
      icon: "pi pi-desktop",
      command: () => {
        navigate("/products");
      },
    },
    {
      label: "Contact",
      icon: "pi pi-star",
      command: () => {
        navigate("/contact");
      },
    },
    {
      label: "About",
      icon: "pi pi-search",
      command: () => {
        navigate("/about");
      },
    },
  ];

  return (
    <div className="sticky top-0 z-5">
      <Menubar
        style={{ border: "none", boxShadow: "none" }}
        model={items}
        start={<Button icon="pi pi-bars" onClick={() => setVisible(true)} />}
        end={<UserButtons setCartSidebarVisible={setCartSidebarVisible}></UserButtons>}
      ></Menubar>
    </div>
  );
};

export default AppNavbar;
