import "primeflex/primeflex.css";

const MainContent = ({ children }) => {
  return (
    <>
      <div
        className="flex flex-column justify-content-center"
        style={{
          minHeight: "75vh",
          width: "100%",
          marginLeft: "1em",
          marginRight: "1em",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default MainContent;
