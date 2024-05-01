import { PanelMenu } from "primereact/panelmenu";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService.ts";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";

type SidebarItem = {
  category: string;
  icon: string;
  items: [{ id: number; name: string }];
};

const AppSidebar = ({ visible, setVisible }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const itemRenderer = (item) => {
    return (
      <>
        <i className={`bi ${item.icon}`}></i>
        <span>
          {"  "}
          {item.category}
        </span>
      </>
    );
  };

  useEffect(() => {
    const getMenuItems = async () => {
      const results = (await ApiService.get("/menu/objects")) as SidebarItem[];
      setMenuItems(
        results.map((item) => {
          return {
            label: itemRenderer(item),
            items: item.items.map((subItem) => ({
              label: subItem.name,
              command: () => {
                navigate(`/products?type=${subItem.id}&title=${subItem.name}`);
                setVisible(false);
              },
            })),
          };
        }),
      );
    };
    getMenuItems();
  }, []);

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      style={{ width: "24rem" }}
    >
      <h4>Categorias</h4>
      <PanelMenu model={menuItems} />
    </Sidebar>
  );
};

export default AppSidebar;
