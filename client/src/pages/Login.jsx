import React, { useState } from "react";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  return (
    <div>
      <img
        src={assets.logo}
        alt="Login"
        className="absolute top-4 left-4 w-28 sm:w-32 cursor-pointer"
      />
      <div>
        <h2>
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your account"}
        </h2>
      </div>
    </div>
  );
};

export default Login;
