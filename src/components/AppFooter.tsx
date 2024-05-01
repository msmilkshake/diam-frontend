import { useNavigate } from "react-router-dom";
import React from "react";

const AppFooter = () => {
  const navigate = useNavigate();
  const items = [
    {
      template: <></>,
    },
    {
      template: (
        <>
          <span className="ml-3">Hello world</span>
        </>
      ),
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
    <div className="card">
      <div className="flex flex-row justify-content-start gap-3 p-menubar"
      style={{padding: '0.75rem 1.25rem'}}
      >
        <span>© {new Date().getFullYear()} TailWagSoft</span>
      </div>
    </div>
  );
};

export default AppFooter;
