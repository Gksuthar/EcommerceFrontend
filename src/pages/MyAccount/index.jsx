import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import UserSiteBarManager from "../../components/userSiteBarManager/index";
import { MyContext } from "../../App";
import { Audio } from "react-loader-spinner";
import useFetch from "../../DataFetch/getDataContext.jsx";
import { InfinitySpin } from "react-loader-spinner";

const MyAccount = () => {
  const [user, setUser] = useState({ name: "", email: "", mobile: "" });
  const context = useContext(MyContext);
  const url = context.AppUrl;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const {
    data: fetchedData,
    loading,
    error,
  } = useFetch(`${url}/api/user/user-details`, token);

  useEffect(() => {
    if (!context.isLogin) {
      navigate("/");
      return;
    }

    if (fetchedData) {
      setUser(fetchedData);
    }
  }, [context.isLogin, fetchedData, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <InfinitySpin
          visible={true}
          width="200"
          color="#4fa94d"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error.message || "An error occurred"}
      </div>
    );
  }

  return (
    <div className="py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        <UserSiteBarManager />

        <div className="col2 w-full lg:w-[70%] mt-4">
          <div className="card bg-white p-5 shadow-md rounded-md">
            <h2 className="pb-3 text-[18px] font-[500]">My Profile</h2>
            <hr />
            <form className="mt-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-full sm:w-[50%]">
                  <TextField
                    label="Full Name"
                    name="name"
                    className="w-full"
                    size="small"
                    onChange={handleInputChange}
                    value={user.name}
                    variant="outlined"
                  />
                </div>
                <div className="w-full sm:w-[50%]">
                  <TextField
                    name="email"
                    label="Email"
                    className="w-full"
                    value={user.email}
                    onChange={handleInputChange}
                    size="small"
                    variant="outlined"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row mt-4 items-center gap-5">
                <div className="w-full sm:w-[50%]">
                  <TextField
                    name="mobile"
                    label="Phone Number"
                    className="w-full"
                    value={user.mobile}
                    onChange={handleInputChange}
                    size="small"
                    variant="outlined"
                  />
                </div>
              </div>

              <br />
              <div className="flex justify-center sm:justify-start">
                <Button className="btn-org btn-lg w-full sm:w-[150px]">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
