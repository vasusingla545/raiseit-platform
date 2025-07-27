import React from 'react'
import axios from "axios";
import Loading from "./Loading";
import districts from "../data/districts";
import { useNavigate } from "react-router-dom";

export default function AddNewOfficer(props) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
     const [data, setData] = React.useState({
      name: "",level:-1,department:"",email:"",password:""
     });
     function handleChange(e){
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
     }
      const [loading, setLoading] = React.useState(false);
      function checkLogin() {
        if (!token) {
          navigate("/userAdminLogin");
        }
      }
      console.log(data.level)
      function handleSubmit(){
        if(data.name=="" || data.level==-1 || data.department=="" || data.email=="" || data.password==""){
          alert("Please fill all the fields");
        }
        else if(data.name.length < 3){
          alert("Name should be at least 3 characters long");
        }
        else if(data.password.length < 6){
          alert("Password should be at least 6 characters long");
        }
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
          alert("Please enter a valid email address");
        }
        else if(data.district == ""){
          alert("Please select a district");
        }
        else{
          setLoading(true)
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:3000/api/v1/manage/registerOfficer",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            data: data,
          };
          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              setLoading(false)
              alert("Officer Added Successfully")
              window.location.reload(true);
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
              if (error.response && error.response.data && error.response.data.message) {
                alert("Error Occurred: " + error.response.data.message);
              } else if (error.response && error.response.data && error.response.data.error) {
                alert("Error Occurred: " + error.response.data.error);
              } else {
                alert("Error Occurred: Please try again");
              }
            });
        }
      }
  return (
    <div>
      {checkLogin()}

      <div
        className={
          props.visible == "new"
            ? "p-4 update-profile-content dashboard w-max ml-48 h-100 mx-auto pt-10"
            : "hidden"
        }
      >

          <h1 className="md:text-7xl text-4xl font-bold text-black capitalize dark:text-black py-4 text-center px-10  ">
            ADD NEW OFFICER
          </h1>
          <div className="flex justify-center">
            <div className="border-2 shadow-2xl p-6 mt-8 w-11/12 md:w-4/6 rounded-xl">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 px-4">
                <div>
                  <label
                    className="text-black dark:text-gray-200"
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    onChange={(e) => handleChange(e)}
                  />
                </div>

                <div>
                  <label
                    className="text-black dark:text-gray-200"
                    htmlFor="Subject"
                  >
                    level
                  </label>
                  <select
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    value={data.level}
                    name="level"
                    onChange={(e) => handleChange(e)}
                  >
                    <option value={-1}>--Select--</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                  {loading == true && <Loading />}
                </div>
                <div>
                  <label
                    className="text-black dark:text-gray-200"
                    htmlFor="Department"
                  >
                    Department
                  </label>
                  <select
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    onChange={(e) => handleChange(e)}
                    name="department"
                    value={data.department}
                  >
                    <option>--SELECT--</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Transport">Transport</option>
                    <option value="Pension">Pension</option>
                    <option value="other">other</option>
                  </select>
                </div>
              

                <div>
                  <label
                    className="text-black dark:text-gray-200"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div>
                  <label
                    className="text-black dark:text-gray-200"
                    htmlFor="password"
                  >
                    Password:
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-6 " color="black">
            <button
              className="bg-light-green p-2 md:p-3 w-32 rounded-3xl text-white text-xl"
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
        </div>
      </div>
  );
}
