import 'primeflex/primeflex.css'

const MainContent = ({ children }) => {
  return <div
      className="flex flex-column justify-content-center"
      style={{ minHeight: '70vh', width: '100%', marginLeft: '1em', marginRight: '1em', backgroundColor: '#1f2937'}}>
    {children}
  </div>;
};

export default MainContent;
