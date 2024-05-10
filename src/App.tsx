import "./App.css";
import React, { useEffect, useReducer, useRef, useState } from "react";
import "primeflex/primeflex.css";
import AppSidebar from "./components/AppSidebar.tsx";
import MainContent from "./components/MainContent.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
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
import ApiService from "./services/ApiService.ts";
import ProductManagement from "./components/ProductManagement.tsx";
import { ToastContext, ToastFunction } from "./contexts/ToastContext.ts";
import { Toast } from "primereact/toast";
import DiscountManagement from "./components/DiscountManagement.tsx";
import UserManagement from "./components/UserManagement.tsx";
import OrdersList from "./components/OrdersList.tsx";
import Cookies from "js-cookie";

function App() {
  axios.defaults.withCredentials = true;

  const [appSidebarVisible, setAppSidebarVisible] = useState<boolean>(false);
  const [cartSidebarVisible, setCartSidebarVisible] = useState<boolean>(false);

  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const [user, userDispatch] = useReducer(loginReducer, null);
  // const cartDispatch = useContext(CartDispatchContext)

  const [loginVisible, setLoginVisible] = React.useState(false);

  useEffect(() => {
    ApiService.get("/check-session", {
      params: {
        sessionid: Cookies.get("sessionid"),
      },
    }).then((response) => {
      if (response.status === "valid") {
        userDispatch!({
          type: "login",
          user: {
            id: response.user.id,
            username: response.user.username,
            is_staff: response.user.is_staff,
            is_superuser: response.user.is_superuser,
          },
        });
      } else {
        userDispatch!({
          type: "clearUser",
          user: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    getDbCart();
  }, [user]);

  const getDbCart = async () => {
    if (user) {
      const cart = ((await ApiService.get("/cart")) || []) as CartItem[];
      cartDispatch({
        type: "restore",
        payload: cart,
      });
    }
  };
  const toast = useRef<Toast>(null);

  const showToast: ToastFunction = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail });
  };

  return (
    <BrowserRouter>
      <CartContext.Provider value={cartItems}>
        <CartDispatchContext.Provider value={cartDispatch}>
          <LoginContext.Provider value={user}>
            <LoginDispatchContext.Provider value={userDispatch}>
              <ToastContext.Provider value={showToast}>
                <Toast ref={toast} position="top-center"></Toast>
                <div className="App">
                  <AppNavbar
                    setCartSidebarVisible={setCartSidebarVisible}
                    setVisible={setAppSidebarVisible}
                    loginVisible={loginVisible}
                    setLoginVisible={setLoginVisible}
                  ></AppNavbar>
                  <AppSidebar
                    visible={appSidebarVisible}
                    setVisible={setAppSidebarVisible}
                  ></AppSidebar>
                  <CartSidebar
                    visible={cartSidebarVisible}
                    setVisible={setCartSidebarVisible}
                    setLoginVisible={setLoginVisible}
                  ></CartSidebar>
                  <div className="flex flex-row justify-content-center">
                    <MainContent>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/orders" element={<OrdersList />} />
                        <Route
                          path="/management/procucts"
                          element={
                            user?.is_superuser || user?.is_staff ? (
                              <ProductManagement />
                            ) : (
                              <Forbidden />
                            )
                          }
                        />
                        <Route
                          path="/management/discounts"
                          element={
                            user?.is_superuser || user?.is_staff ? (
                              <DiscountManagement />
                            ) : (
                              <Forbidden />
                            )
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            user?.is_superuser ? (
                              <UserManagement />
                            ) : (
                              <Forbidden />
                            )
                          }
                        />
                        <Route
                          path="/products/:id"
                          element={<ProductDetails />}
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainContent>
                  </div>
                  <AppFooter></AppFooter>
                </div>
              </ToastContext.Provider>
            </LoginDispatchContext.Provider>
          </LoginContext.Provider>
        </CartDispatchContext.Provider>
      </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;

const Forbidden = () => (
  <div>
    <h1 style={{ color: "coral" }}>403 Proibido</h1>
    <p>Não tem permissão para aceder a esta página.</p>
  </div>
);

const NotFound = () => (
  <div>
    <h1 style={{ color: "coral" }}>404 Página Não Encontrada</h1>
    <p>Pedimos desculpa, mas não conseguimos encontrar a página pretendida.</p>
  </div>
);
