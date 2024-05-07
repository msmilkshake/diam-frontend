import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import React, {useContext, useEffect, useState} from "react";
import UserButtons from "./UserButtons.tsx";
import { LoginContext } from "../contexts/LoginContext.ts";

const AppNavbar = ({ setVisible, setCartSidebarVisible }) => {
  const navigate = useNavigate();
  const user = useContext(LoginContext);



  const regularNavItems = [
    {
      label: "Página Inicial",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Todos os produtos",
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
  ];

  const staffNavItems = [
    {
      label: "Gestão de Loja",
      items: [
        {
          label: "Gestão de Produtos",
          command: () => {
            navigate("/management/procucts");
          },
        },
        {
          label: "Gestão de Promoções",
          command: () => {
            navigate("/management/discounts");
          },
        },
      ],
    },
  ];

  const adminNavItems = [
    {
      label: "Administração",
      items: [
        {
          label: "Gestão de Utilizadores",
          command: () => {
            navigate("/management/procucts");
          },
        },
      ],
    },
  ];

  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    setNavItems([
        ...regularNavItems,
        ...(user && (user.is_staff || user?.is_superuser) ? staffNavItems : []),
        ...(user && user?.is_superuser ? adminNavItems : []),
    ])
  }, [user]);

  useEffect(() => {

  }, []);

  return (
    <div className="sticky top-0 z-5">
      <Menubar
        style={{ border: "none", boxShadow: "none" }}
        model={navItems}
        start={
          <Button
            icon="pi pi-bars"
            onClick={() => setVisible(true)}
            className={`mr-4`}
          />
        }
        end={
          <UserButtons
            setCartSidebarVisible={setCartSidebarVisible}
          ></UserButtons>
        }
      ></Menubar>
    </div>
  );
};
export default AppNavbar;
