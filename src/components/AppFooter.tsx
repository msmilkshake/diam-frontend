import React from "react";

const AppFooter = () => {

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
