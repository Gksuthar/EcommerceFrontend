import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "../../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { Formik, Form, Field } from "formik"; 

const Login = () => {
  const context = useContext(MyContext);
  const url = context.AppUrl;
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleForgetPassword = async (email) => {
    if (!email) {
      context.openAlertBox("error", "Please enter email");
      return;
    }
    try {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("forgetPassword", "true");
      const response = await axios.post(`${url}/api/user/forgetpassword`, {
        email: email,
      });
      if (response.status === 200) {
        context.openAlertBox("success", "OTP sent");
        navigate("/Verify");
      }
    } catch (error) {
      console.error("Error:", error);
      context.openAlertBox("error", "Failed to send OTP");
    }
  };

  return (
    <div className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10 mt-5">
          <h3 className="text-center !text-[18px] !font-[500] py-2 mb-4">
            Login to your account
          </h3>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setLoading(true);
                const response = await axios.post(`${url}/api/user/Login`, {
                  email: values.email,
                  password: values.password,
                });
                if (response.status === 200) {
                  context.setIsLogin(true);
                  context.openAlertBox("success", "Login successfully");
                  localStorage.setItem("accessToken", response.data.data.accessToken);
                  localStorage.setItem("userId", response.data.data._id);
                  localStorage.setItem("refreshToken", response.data.data.refreshToken);
                  navigate("/");
                } else {
                  console.log("You are not logging");
                }
              } catch (error) {
                if (error.response) {
                  context.openAlertBox("error", error.response.data.message);
                } else if (error.request) {
                  context.openAlertBox("error", "No response received");
                } else {
                  context.openAlertBox("error", error.message);
                }
              } finally {
                setLoading(false);
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, values }) => (
              <Form className="w-full">
                <div className="form-group w-full mb-5">
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    type="email"
                    label="Email id"
                    variant="outlined"
                    className="w-full"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </div>
                <div className="form-group w-full mb-5 relative">
                  <Field
                    as={TextField}
                    id="password"
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    label="Password"
                    variant="outlined"
                    className="w-full"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                  <Button
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="!absolute top-[10px] !text-black right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] opacity-75"
                  >
                    {isShowPassword ? <FaEye className="text-[20px]" /> : <FaEyeSlash className="text-[20px]" />}
                  </Button>
                </div>
                <a
                  className="link cursor-pointer text-[14px] mb-1 font-[600]"
                  onClick={() => handleForgetPassword(values.email)}
                >
                  Forget password
                </a>
                <div className="flex items-center w-full mt-3 btn-lg">
                  <Button type="submit" className="btn-org w-full" disabled={loading}>
                    {loading ? (
                      <TailSpin
                        visible={true}
                        height="23"
                        width="23"
                        color="#4fa94d"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                      />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <p className="text-center mb-1">
                  Not registered?{" "}
                  <Link to="/Register" className="link text-[14px] font-[600]">
                    Sign up
                  </Link>
                </p>
                <p className="text-center text-[12px] font-[500] mb-2 mt-4">
                  Or continue with Social Account
                </p>
                <Button className="flex gap-3 w-full !bg-[#f1f1f1] !btn-lg !text-black mt-2">
                  <FcGoogle className="text-[20px]" />
                  Login with Google
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;