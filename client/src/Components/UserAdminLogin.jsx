import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";   
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "./Loading";
function Login(props){
  const [loginData, setLoginData] = React.useState({email:"", password:""});
  const [user,setUser]=React.useState("Citizen");
  function handleChange(e){
    setLoginData({...loginData, [e.target.name]:e.target.value});
  }
  function handleRadio(e){
    setUser(e.target.value);
  }
  const navigate=useNavigate();
 let config = {
   method: "post",
   maxBodyLength: Infinity,
   url: (user=="Citizen"?(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`):(user=="Officer"?(`${import.meta.env.VITE_API_URL}/api/v1/auth/officer/login`):(`${import.meta.env.VITE_API_URL}/api/v1/auth/admin/login`))) ,
   headers: {
     Authorization: "Bearer ",
     "Content-Type": "application/json",
   },
   data:loginData,
 };
 async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  if (loginData.email === "" || loginData.password === "") {
    setLoading(false);
    alert("Please fill all the fields");
  } else {
    try {
      const response = await axios.request(config);
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        if (user === "Citizen") {
          navigate("/userpage");
        } else if (user === "Officer") {
          navigate("/adminpage");
        } else {
          navigate("/MainAdminPage");
        }
      } else {
        setLoading(false);
        alert("Unexpected response from server.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        alert("Invalid Credentials");
      } else if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
      console.log(error);
    }
  }
}
  const [loading,setLoading]=React.useState(false);
  function forgotPassword(){
    navigate("/ForgotPassword");
  }
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar />
      <div className="flex-row md:flex  md:h-100 mt-0 ">
        <div className="  px-8 md:w-2/3 ">
          <div className="md:px-20 px-10 pt-20  md:pt-48 py-20 ">
            <div className="w-full md:w-2/3 h-64 ">
              <h2 className=" mt-0 text-6xl font-bold text-dark-blue">Raise-It</h2>

              <p className=" mt-4 text  md:text-2xl text-dark-blue ">
                This web application allows the concerned users and admins to
                communicate regarding the grievances with the provided features
                in order to simplify the tedious procedure of listing the
                grievances.
              </p>
            </div>
          </div>
        </div>

        <div className=" md:px-36 px-10 py-20  bg-dark-blue">
          <div className="">
            <p className="mt-3  text-2xl text-white">
              Sign in to access your account
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <label htmlFor="email" className="block text-sm text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  className="block w-full px-4 py-2 mt-2 bg-white rounded-md"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-white">
                    Password
                  </label>
                  <button
                    href="#"
                    className="text-sm text-gray-400 text-white hover:underline"
                    onClick={forgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex justify-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 bg-white  rounded-md"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-white p-2 rounded-3xl m-auto  "
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-2 mt-8 py-1">
                <input
                  defaultChecked
                  id="default-radio-1"
                  type="radio"
                  value="Citizen"
                  name="default-radio"
                  className="w-4 h-4   focus:ring-blue-500 "
                  onChange={handleRadio}
                />
                <label
                  htmlFor="default-radio-1"
                  className="ml-3 text-l  text-white"
                >
                  Citizen
                </label>
              </div>
              <div className=" mb-2 mt-2 flex items-center py-0">
                <input
                  id="default-radio-2"
                  type="radio"
                  value="Officer"
                  name="default-radio"
                  className="w-4 h-4  focus:ring-blue-500"
                  onChange={handleRadio}
                />
                <label
                  htmlFor="default-radio-2"
                  className="ml-3 text-l  text-white"
                >
                  Officer
                </label>
              </div>
              <div className="mt-2 flex items-center py-0">
                <input
                  id="default-radio-3"
                  type="radio"
                  value="Admin"
                  name="default-radio"
                  className="w-4 h-4  focus:ring-blue-500"
                  onChange={handleRadio}
                />
                <label
                  htmlFor="default-radio-3"
                  className="ml-3 text-l  text-white"
                >
                  Admin
                </label>
              </div>

              <div className="mt-6 flex justify-center ">
                <button
                  className="w-1/2 hover:animate-bounce  px-4 py-2  text-white bg-light-green rounded-md"
                  onClick={handleSubmit}
                >
                  Sign in
                </button>
                {loading && <Loading />}
              </div>
            </div>

            <p className="mt-6 text-sm text-center text-white">
              Don't have an account yet?{" "}
              <NavLink to="/" className="text-light-green hover:underline">
                Sign up
              </NavLink>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
