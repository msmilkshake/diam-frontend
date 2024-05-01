import { PanelMenu } from "primereact/panelmenu";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService.ts";
import "bootstrap-icons/font/bootstrap-icons.css";

type SidebarItem = {
  category: string;
  icon: string;
  items: [string];
};

const AppSidebar = ({ visible, setVisible }) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const itemRenderer = (item) => {
    return (
        <>
          <i className={`bi ${item.icon}`}></i>
          <span>{"  "}{item.category}</span>
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
              label: subItem,

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
        style={{width: "24rem"}}
    >
      <h4>Categorias</h4>
      <PanelMenu model={menuItems}/>
    </Sidebar>
  );
};

export default AppSidebar;
