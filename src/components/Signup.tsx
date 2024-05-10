import { Button } from "primereact/button";

import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useState } from "react";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { LoginContext } from "../contexts/LoginContext.ts";
import ApiService, { jsonHeaders } from "../services/ApiService.ts";

interface SignupFormProps {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  phone: string;
  vat: number | undefined;
}

const countries = ["Portugal", "Espanha"];

const SignupPage = () => {
  const [countryDropdown, setCountryDropdown] = useState(countries[0]);
  const navigate = useNavigate();

  const user = useContext(LoginContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target.elements.username.value);
    console.log(e.target.elements.password.value);
    if (
      e.target.elements.password.value ===
      e.target.elements.confirmpassword.value
    ) {
      const username = e.target.elements.username.value;
      const email = e.target.elements.email.value;
      const password = e.target.elements.password.value;
      const address1 = e.target.elements.address1.value;
      const address2 = e.target.elements.address2.value;
      const city = e.target.elements.city.value;
      const country = e.target.elements.country.value;
      const phone = e.target.elements.phone.value;
      const vat = e.target.elements.vat.value;

      await ApiService.get("/login");
      const response = ApiService.post(
        "/signup",
        {
          username,
          password,
          email,
          address1,
          address2,
          city,
          country,
          phone,
          vat,
        },
        jsonHeaders(),
      );
      console.log("Signup successful:", response.data);
      navigate("/");
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <>
      <h1>Página de Registo</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-content-evenly align-items-stretch gap-3">
          <Card className="flex-grow-1">
            <div className="flex flex-column gap-3 align-items-center">
              <Divider>
                <span>Detalhes da Conta</span>
              </Divider>
              <div className="flex flex-column justify-content-start">
                <label htmlFor="username">
                  Nome de utilizador<sup style={{ color: "red" }}>*</sup>
                </label>
                <InputText required name="username"></InputText>
              </div>
              <div className="flex flex-column ">
                <label htmlFor="email">
                  Email<sup style={{ color: "red" }}>*</sup>
                </label>
                <InputText required name="email"></InputText>
              </div>
              <div className="flex flex-column justify-content-start">
                <label htmlFor="password">
                  Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <Password required name="password"></Password>
              </div>
              <div className="flex flex-column justify-content-start">
                <label htmlFor="confirmpassword">
                  Confirmar Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <Password required name="confirmpassword"></Password>
              </div>
            </div>
          </Card>
          <div className="flex flex-column flex-grow-1 gap-3">
            <div className="flex-grow-1">
              <Card>
                <div className="flex flex-column gap-3 align-items-center">
                  <Divider>
                    <span>Morada</span>
                  </Divider>
                  <div className="flex flex-column align-content-start">
                    <label htmlFor="address1">
                      Linha 1<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <InputText required name="address1"></InputText>
                  </div>
                  <div className="flex flex-column justify-content-start">
                    <label htmlFor="address2">Linha 2</label>
                    <InputText name="address2"></InputText>
                  </div>
                  <div className="flex flex-column justify-content-start">
                    <label htmlFor="city">
                      Cidade<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <InputText required name="city"></InputText>
                  </div>
                  <div className="flex flex-column justify-content-start">
                    <label htmlFor="country">
                      País<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Dropdown
                      required
                      value={countryDropdown}
                      onChange={(e) => setCountryDropdown(e.value)}
                      options={countries}
                      name="country"
                    ></Dropdown>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex-grow-1">
              <Card>
                <div className="flex flex-column gap-3 align-items-center">
                  <Divider>
                    <span>Detalhes Pessoais</span>
                  </Divider>
                  <div className="flex flex-column justify-content-start">
                    <label htmlFor="phone">
                      Telemóvel<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <InputText required name="phone"></InputText>
                  </div>
                  <div className="flex flex-column justify-content-start">
                    <label htmlFor="vat">
                      Número de contribuínte
                      <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <InputText required name="vat"></InputText>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-3 align-items-center justify-content-evenly">
          <Card className="flex-grow-1">
            <Button label="Registar" type="submit" />
          </Card>
        </div>
      </form>
    </>
  );
};

export default SignupPage;
