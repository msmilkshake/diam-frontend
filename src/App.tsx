import "./App.css";
import React, { useReducer, useState } from "react";
import "primeflex/primeflex.css";
import AppSidebar from "./components/AppSidebar.tsx";
import MainContent from "./components/MainContent.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import AboutPage from "./components/AboutPage.tsx";
import ContactPage from "./components/ContactPage.tsx";
import AppNavbar from "./components/AppNavbar.tsx";
import AppFooter from "./components/AppFooter.tsx";
import axios from "axios";
import ProductList from "./components/ProductList.tsx";
import {
  CartContext,
  CartDispatchContext,
  cartReducer,
} from "./contexts/CartContext.ts";

function App() {
  axios.defaults.withCredentials = true;

  const [visible, setVisible] = useState<boolean>(false);
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);

  return (
    <BrowserRouter>
      <CartContext.Provider value={cartItems}>
        <CartDispatchContext.Provider value={cartDispatch}>
          <div className="App">
            <AppNavbar setVisible={setVisible}></AppNavbar>
            <AppSidebar visible={visible} setVisible={setVisible}></AppSidebar>
            <div className="flex flex-row justify-content-center">
              <MainContent>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/products" element={<ProductList />} />
                </Routes>
              </MainContent>
            </div>
            <AppFooter></AppFooter>
          </div>
        </CartDispatchContext.Provider>
      </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;
