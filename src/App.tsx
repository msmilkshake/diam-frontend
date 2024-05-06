import "./App.css";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "primeflex/primeflex.css";
import AppSidebar from "./components/AppSidebar.tsx";
import MainContent from "./components/MainContent.tsx";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
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
import ApiService from "./services/ApiService.ts";
import { ProductManagement } from "./components/ProductManagement.tsx";
import { ToastContext, ToastFunction } from "./contexts/ToastContext.ts";
import { Toast } from "primereact/toast";

function App() {
  axios.defaults.withCredentials = true;

  const [appSidebarVisible, setAppSidebarVisible] = useState<boolean>(false);
  const [cartSidebarVisible, setCartSidebarVisible] = useState<boolean>(false);

  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const [user, userDispatch] = useReducer(loginReducer, null);
  // const cartDispatch = useContext(CartDispatchContext)

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/check-session", {
        params: {
          sessionid: localStorage.getItem("sessionid"),
        },
      })
      .then((response) => {
        if (response.data.status === "valid") {
          userDispatch!({
            type: "login",
            user: {
              id: response.data.user.id,
              username: response.data.user.username,
              is_staff: response.data.user.is_staff,
              is_superuser: response.data.user.is_superuser,
            },
          });
        } else {
          userDispatch!({
            type: "logout",
            user: null,
          });
        }
      });

  }, []);

  useEffect(() => {
    getDbCart();
  }, [user]);
  const getDbCart = async () => {
    const cart = ((await ApiService.get("/cart")) || []) as CartItem[];
    cartDispatch({
      type: "restore",
      payload: cart,
    });
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
                <Toast ref={toast}></Toast>
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
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route
                          path="/management/procucts"
                          element={
                            user?.is_superuser || user?.is_staff ? (
                              <ProductManagement />
                            ) : (
                              <Unauthorized />
                            )
                          }
                        />
                        <Route
                          path="/management/discounts"
                          element={
                            user?.is_superuser || user?.is_staff ? (
                              <ProductManagement />
                            ) : (
                              <Unauthorized />
                            )
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            user?.is_superuser ? (
                              <ProductList />
                            ) : (
                              <Unauthorized />
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

const Unauthorized = () => (
  <div>
    <h1 style={{ color: "coral" }}>Não Autorizado</h1>
    <p>Não tem autorização para aceder a esta página.</p>
  </div>
);

const NotFound = () => (
  <div>
    <h1 style={{ color: "coral" }}>404 Página Não Encontrada</h1>
    <p>Pedimos desculpa, mas não conseguimos encontrar a página pretendida.</p>
  </div>
);
