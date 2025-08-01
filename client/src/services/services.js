import axios from "axios";

export default {
  getAll: async () => {
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

let data = JSON.stringify({
  name: "vishesh",
  email: "v@gmail.com",
  password: "secretpass",
  age: 20,
  phone: "9903785230",
  district: "delhi",
});

const apiUrl = import.meta.env.VITE_API_URL;
let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${apiUrl}/api/v1/auth/register`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};



