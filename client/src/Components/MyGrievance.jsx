import React, { Fragment } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "./Modal";
import Loading from "./Loading";
export default function MyGrievance(props) {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_API_URL}/api/v1/complaints`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [grievances, setGrievances] = React.useState([]);
 grievances.sort(function (a, b) {
   return a.status > b.status ? 1 : b.status > a.status ? -1 : 0;
 });
  React.useEffect(() => {
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setGrievances(response.data.complaints);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const [isVisible, setIsVisible] = React.useState(false);
  const [actionHistory, setActionHistory] = React.useState();
  function handleAction(grievance){
    setActionHistory(grievance.actionHistory)
    setIsVisible((prev) => !prev)
  }
  function handleReopen(id){
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/api/v1/complaints/${id}`,
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("Reopened Successfully");
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occured")
      });
  }
  function handleReminder(id){
    setLoading(true)
    let config2 = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/api/v1/complaints/reminder/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config2)
      .then((response) => {
         setLoading(false);
        alert("Reminder Sent Successfully")
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occured")
      });
  }
  const [loading, setLoading] = React.useState(false);
  // const [rating,setRating]=React.useState(-1);

  // function changeRating(e){
  //   setRating(e.target.value)
    
  // }
  const [rating, setRatings] = React.useState({});
function changeRating(id, value) {
  setRatings(prev => ({ ...prev, [id]: value }));
}
console.log(rating);

 function handleRating(id) {
  const selectedRating = rating[id];
  console.log('Submitting rating for complaint:', id, 'Rating:', selectedRating);
  
  if (!selectedRating || selectedRating === "" || selectedRating === -1) {
    alert("Rating not given");
    return;
  }
  setLoading(true);

  let config3 = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_API_URL}/api/v1/complaints/rateOfficer/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: { rating: selectedRating },
  };

  console.log('Sending request:', config3);

  axios
    .request(config3)
    .then((response) => {
      console.log('Rating response:', response.data);
      alert("Rating submitted");
      window.location.reload(true);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Rating error:', error.response ? error.response.data : error);
      alert("Error submitting rating: " + (error.response?.data?.message || error.message));
      setLoading(false);
    });
}
  function handleDelete(id){
    setLoading(true)
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/api/v1/complaints/${id}`,
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        alert("Deleted Successfully")
        setLoading(false)
        window.location.reload(true)
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occured")
        setLoading(false)
      });
  }
  const grievanceData = grievances.map((grievance) => (
    // <Fragment>
     <Fragment key={grievance._id}>
      <tr
        className={
          grievance.status != "resolved"
            ? grievance.status == "pending"
              ? "bg-red"
              : "bg-yellow"
            : "bg-green"
        }
      >
        <td className="px-4 py-3 text-ms font-semibold border">
          {moment(grievance.createdAt).format("DD/MM/YYYY HH:mm")}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.department}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.subject}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status != "resolved" ? (
            grievance.lastRemindedAt == null ||
            new Date().getDate() -
              new Date(grievance.lastRemindedAt).getDate() >
              1 ? (
              <>
                <button
                  className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleReminder(grievance._id)}
                >
                  reminder
                </button>
                {loading == true && <Loading />}
              </>
            ) : (
              `Cooldown for ${
                7 -
                (new Date().getDate() -
                  new Date(grievance.lastRemindedAt).getDate())
              } more days`
            )
          ) : (
            "resolved"
          )}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          <button
            className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAction(grievance)}
          >
            View
          </button>
          <Modal
            visible={isVisible}
            setVisible={setIsVisible}
            data={actionHistory}
          />
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status == "resolved" && grievance.isRated == false && (
            <button
              className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  "
              onClick={() => handleReopen(grievance._id)}
            >
              Reopen
            </button>
          )}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status == "resolved" && grievance.isRated == false ? (
            <form className="flex justify-evenly">
              <select
                name="rating"
                id="rating"
               value={rating[grievance._id] || ""}
  className="rounded-2xl"
  onChange={e => changeRating(grievance._id, e.target.value)}
              >
                <option value="">--Rate--</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Star</option>
                <option value={3}>3 Star</option>
                <option value={4}>4 Star</option>
                <option value={5}>5 Star</option>
              </select>
              <button
                className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 "
                onClick={() => handleRating(grievance._id)}
              >
                Rate
              </button>
            </form>
          ) : grievance.status == "resolved" ? (
            "Thank you for your feedback"
          ) : (
            "We are working on it"
          )}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status != "resolved" && (
            <button
              className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  "
              onClick={() => handleDelete(grievance._id)}
            >
             Delete
            </button>
          )}
        </td>
      </tr>
    </Fragment>
  ));
function checkLogin() {
  if (!token) {
    navigate("/userAdminLogin");
  }
}
  return (
    <>
      {checkLogin}
      <div
        className={
          props.visible == "view"
            ? "p-4 view-grievance dashboard w-full md:w-3/4 h-100  pt-10  "
            : "hidden"
        }
      >
        <h1 className="text-center text-4xl md:text-7xl font-semibold">
          MY GRIEVANCES
        </h1>
        <section className="container mx-auto font-mono flex justify-center">
          <div className=" pt-4 mb-8 overflow-y-scroll overflow-x-scroll h-120  mt-4 border-2 shadow-2xl rounded-xl p-6 overflow-hidden w-11/12 md:w-5/6">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Grievance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reminder</th>
                    <th className="px-4 py-3 mx-auto">View Action History</th>
                    <th className="px-4 py-3 mx-auto">Reopen</th>
                    <th className="px-4 py-3 mx-auto">Give Rating</th>
                    <th className="px-4 py-3 mx-auto">Delete Complaint</th>
                  </tr>
                </thead>
                <tbody className="bg-white">{grievanceData}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
