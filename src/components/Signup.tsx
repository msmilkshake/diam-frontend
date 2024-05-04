import { Button } from "primereact/button";
import "primeflex/primeflex.css";


import {InputText} from "primereact/inputtext";
import React, {useState} from "react";
import {Password} from "primereact/password";

interface SignupFormProps {
  username: string,
  password: string,
  passwordConfirm: string,
  email: string,
  address1: string,
  address2?: string,
  city: string,
  country: string,
  phone: string,
  vat: number | undefined,
}


const SignupPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e.target.elements.username.value)
    console.log(e.target.elements.password.value)

  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-3">
          <div className="flex flex-column justify-content-start">
            <label htmlFor="username">Username</label>
            <InputText
                name="username"
            ></InputText>
          </div>
          <div className="flex flex-column justify-content-start">
            <label htmlFor="email">Email</label>
            
            <InputText
                name="email"
            ></InputText>
          </div>
          <div className="flex flex-column justify-content-start">
            <label htmlFor="password">Password</label>
            <Password
                name="password"
            ></Password>
          </div>
          <div className="flex flex-column justify-content-start">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <Password
                name="confirmpassword"
            ></Password>
          </div>
          <Button label="Login" type="submit"/>
        </div>
      </form>
    </>
  );
};

export default SignupPage;
