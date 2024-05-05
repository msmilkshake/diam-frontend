import "./App.css";
import React, { useContext, useEffect, useReducer, useState } from "react";
import "primeflex/primeflex.css";
import AppSidebar from "./components/AppSidebar.tsx";
import MainContent from "./components/MainContent.tsx";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
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
  CartItem,
  cartReducer,
} from "./contexts/CartContext.ts";
import {
  LoginContext,
  LoginDispatchContext,
  loginReducer,
} from "./contexts/LoginContext.ts";
import CartSidebar from "./components/CartSidebar.tsx";
import ProductDetails from "./components/ProductDetails.tsx";
import SignupPage from "./components/Signup.tsx";
import Cookies from "js-cookie";
import ApiService from "./services/ApiService.ts";

function App() {
  axios.defaults.withCredentials = true;

  const [appSidebarVisible, setAppSidebarVisible] = useState<boolean>(false);
  const [cartSidebarVisible, setCartSidebarVisible] = useState<boolean>(false);

  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const [user, userDispatch] = useReducer(loginReducer, null);
  // const cartDispatch = useContext(CartDispatchContext)

  useEffect(() => {
    axios.get('http://localhost:8000/api/check-session',{
      params: {
        sessionid: localStorage.getItem("sessionid"),
      }
    }).then(response => {
      // console.log(response.data)
      if (response.data.status === "valid"){
        userDispatch!({
          type: "login",
          user: {
            id: response.data.userid,
            username: response.data.username,
          }
        })
      }
      else{
        userDispatch!({
          type: "logout",
          user: null,
        })
      }
    })
  }, []);



  return (
    <BrowserRouter>
      <CartContext.Provider value={cartItems}>
        <CartDispatchContext.Provider value={cartDispatch}>
          <LoginContext.Provider value={user}>
            <LoginDispatchContext.Provider value={userDispatch}>
              <div className="App">
                <AppNavbar
                  setCartSidebarVisible={setCartSidebarVisible}
                  setVisible={setAppSidebarVisible}
                ></AppNavbar>
                <AppSidebar
                  visible={appSidebarVisible}
                  setVisible={setAppSidebarVisible}
                ></AppSidebar>
                <CartSidebar
                  visible={cartSidebarVisible}
                  setVisible={setCartSidebarVisible}
                ></CartSidebar>
                <div className="flex flex-row justify-content-center">
                  <MainContent>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<SignupPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/products" element={<ProductList />} />
                      <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                      />
                    </Routes>
                  </MainContent>
                </div>
                <AppFooter></AppFooter>
              </div>
            </LoginDispatchContext.Provider>
          </LoginContext.Provider>
        </CartDispatchContext.Provider>
      </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;
