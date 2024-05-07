import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import Cookies from "js-cookie";
import {
  LoginContext,
  LoginDispatchContext,
} from "../contexts/LoginContext.ts";
import { CartContext } from "../contexts/CartContext.ts";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.ts";

const UserButtons = ({ setCartSidebarVisible }) => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const [dialogPos, setDialogPos] = useState({ top: "0", left: "0" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginVisible, setLoginVisible] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const userDispatch = useContext(LoginDispatchContext);
  const user = useContext(LoginContext);

  const showToast = useToast();

  useEffect(() => {
    const sessionCookie = localStorage.getItem("sessionid");
    if (sessionCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.get("http://localhost:8000/api/login");
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        },
      );

      if (response.status === 200) {
        console.log("Response true!", response);
        userDispatch!({
          type: "login",
          user: {
            id: response.data.userid,
            username: response.data.username,
            is_superuser: response.data.is_superuser,
            is_staff: response.data.is_staff,
          },
        });
        localStorage.setItem("sessionid", response.data.session_key);
        setUsername("");
        setPassword("");
        setIsLoggedIn(true);
        setLoginError(false);
        console.log("Logged in with username: ", response.data.username);
      } else {
        setLoginError(true);
        console.log("Login failed! response:", response);
      }
    } catch (err) {
      setLoginError(true);
      console.log(err);
    }
  };

  useEffect(() => {
    if (loginVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [loginVisible]);

  const handleOutsideClick = (event) => {
    if (event.target.closest(".p-dialog") === null) {
      setLoginVisible(false);
    }
  };

  const itemRenderer = (icon) => {
    return (
      <>
        <i className={`bi ${icon}`} style={{ fontSize: "1.2rem" }}></i>
      </>
    );
  };

  useEffect(() => {
    setBadgeNumber(calculateCartItems());
  }, [cartContext]);

  const calculateCartItems = () => {
    return cartContext?.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };
  const [badgeNumber, setBadgeNumber] = useState(calculateCartItems());

  const cartRenderer = (icon) => {
    return (
      <>
        <div className="flex flex-row align-content-center gap-1">
          <i className={`bi ${icon}`} style={{ fontSize: "1.2rem" }}></i>
          <Badge value={badgeNumber} severity="danger"></Badge>
        </div>
      </>
    );
  };

  const show = (event) => {
    const buttonRect =
      event.originalEvent.currentTarget.getBoundingClientRect();
    setDialogPos({
      top: `${buttonRect.top + 40}px`,
      left: `${buttonRect.left - 375}px`,
    });
    setLoginVisible(true);
  };
  const toggleCartSidebar = () => {
    setCartSidebarVisible(true);
  };
  const items = [
    {
      label: itemRenderer("bi-person"),
      command: (event) => {
        show(event);
      },
    },
    {
      label: cartRenderer("bi-cart"),
      command: () => {
        toggleCartSidebar();
      },
    },
  ];

  const handleLogout = () => {
    userDispatch!({
      type: "logout",
      user: null,
    });
    setIsLoggedIn(false);
    setLoginVisible(false);
    showToast("info", "Logout", "Efetuou logout com sucesso.");
  };

  return (
    <>
      <Menubar
        style={{ border: "none", boxShadow: "none", padding: 0 }}
        model={items}
      ></Menubar>
      {!isLoggedIn && (
        <Dialog
          header="Iniciar sessão"
          visible={loginVisible}
          style={{ width: "400px", position: "fixed", ...dialogPos }}
          onHide={() => {
            setUsername("");
            setPassword("");
            setLoginVisible(false);
          }}
          // footer={footerContent}
          draggable={false}
          resizable={false}
          modal={false}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-column gap-3">
              {loginError && (
                <div>
                  <span style={{ color: "indianred" }}>
                    Credenciais inválidas
                  </span>
                </div>
              )}
              <div className="flex flex-column justify-content-start">
                <label htmlFor="username">Nome de utilizador</label>
                <InputText
                  id="loginUsername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                ></InputText>
              </div>
              <div className="flex flex-column justify-content-start">
                <label htmlFor="password">Password</label>
                <InputText
                  type="password"
                  id="loginPassword"
                  onFocus={() => setPassword("")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></InputText>
              </div>
              <Button
                disabled={!username || !password}
                label="Iniciar sessão"
                type="submit"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                  setLoginVisible(false);
                }}
                label="Criar conta"
              ></Button>
            </div>
          </form>
        </Dialog>
      )}
      {isLoggedIn && (
        <Dialog
          header="Com sessão iniciada!"
          visible={loginVisible}
          style={{ width: "400px", position: "fixed", ...dialogPos }}
          onHide={() => setLoginVisible(false)}
          draggable={false}
          resizable={false}
          modal={false}
        >
          <div className="flex flex-column align-content-start flex-wrap gap-3">
            <h2>Olá {user?.username}!</h2>
            <Button onClick={handleLogout}>Terminar sessão</Button>
            <div className="block">
            <Button onClick={handleLogout}>Histórico de encomendas</Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default UserButtons;
