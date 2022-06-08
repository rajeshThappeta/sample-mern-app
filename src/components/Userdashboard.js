import {useState} from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";

function Userdashboard() {
  let { userObj } = useSelector((state) => state.user);
  let [data,setData]=useState("")

  const getProtectedData = async () => {
    let token=localStorage.getItem("token")
    let response = await axios.get("/user/test",{headers:{Authorization:token}});
    setData(response.data.message)
  };

  return (
    <div>
      <p className="display-6 text-end">Welcome,{userObj.username}</p>
      <Button variant="danger" onClick={getProtectedData}>
        Get Protected data
      </Button>
      <h1 className="text-cernter text-info">{data}</h1>
    </div>
  );
}

export default Userdashboard;
