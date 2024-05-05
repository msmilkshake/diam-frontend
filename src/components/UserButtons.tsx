import "bootstrap-icons/font/bootstrap-icons.css";
import React, {useContext, useEffect, useReducer, useState} from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import Cookies from "js-cookie";
import {LoginContext, LoginDispatchContext} from "../contexts/LoginContext.ts";

const UserButtons = ({setCartSidebarVisible}) => {
  const [cartItems, setCartItems] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dialogPos, setDialogPos] = useState({ top: "0", left: "0" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginVisible, setLoginVisible] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userDispatch = useContext(LoginDispatchContext)
  const user = useContext(LoginContext)

  useEffect(() => {
    const sessionCookie = localStorage.getItem("sessionid");
    // console.log("session cookie:", sessionCookie);
    if (sessionCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.get("http://localhost:8000/api/login");
      // console.log("User before login:", user)
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
        console.log("Response true!", response)
        userDispatch!({
          type: "login",
          user: {
            id: response.data.userid,
            username: response.data.username,
          }
        })
        localStorage.setItem('sessionid', response.data.session_key);
        setUsername("");
        setPassword("");
        setIsLoggedIn(true)
        console.log("Logged in with username: ", response.data.username)
      } else {
        console.log("Login failed! response:", response)
      }
    } catch (err) {
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

  const cartRenderer = (icon) => {
    return (
      <>
        <div className="flex flex-row align-content-center gap-1">
          <i className={`bi ${icon}`} style={{ fontSize: "1.2rem" }}></i>
          <Badge value={cartItems} severity="danger"></Badge>
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
  }
  const items = [
    {
      label: itemRenderer("bi-plus"),
      command: () => {
        setCartItems(cartItems + 1);
      },
    },
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

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

  const handleLogout = () => {
    userDispatch!({
      type: "logout",
      user: null,
    })
    setIsLoggedIn(false);
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
            setUsername("")
            setPassword("")
            setLoginVisible(false);
          }}
          // footer={footerContent}
          draggable={false}
          resizable={false}
          modal={false}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-column gap-3">
              <div className="flex flex-column justify-content-start">
                <label htmlFor="username">Username</label>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></InputText>
              </div>
              <Button label="Login" type="submit" />
            </div>
          </form>
        </Dialog>
      )}
      {isLoggedIn && (
        <Dialog
          header="Iniciar sessão"
          visible={loginVisible}
          style={{ width: "400px", position: "fixed", ...dialogPos }}
          onHide={() => setLoginVisible(false)}
          draggable={false}
          resizable={false}
          modal={false}
        >
          <h2>Welcome {user?.username}!</h2>
          <Button onClick={handleLogout}>Logout</Button>
        </Dialog>
      )}
    </>
  );
};

export default UserButtons;
