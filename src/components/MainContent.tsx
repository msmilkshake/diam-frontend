import "primeflex/primeflex.css";
import { Toast } from 'primereact/toast';

const MainContent = ({ children }) => {
  return (
    <>
        <Toast>

        </Toast>
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
