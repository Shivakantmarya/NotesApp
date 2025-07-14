import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const apiUrl = "https://notesapp-qobz.onrender.com";

  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const changeData = (e) => {
    const { name, value } = e.target;
    setData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const handlefileChange = (e) =>{
      setProfilePic(e.target.files[0]);
  }

  const submitData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilePic", profilePic);


    try{
        const res =  await axios.post(`${apiUrl}/api/user/register`, formData, {
            headers:{
              //  "Content-Type": "multipart/form-data"
              "Content-Type" : "multipart/form-data"
            }
         });

         console.log("SignUp response", res.data);

         if(res.data.message === "User Save Succefully!"){
            setSuccess("SignUp Successfull!");
            navigate("/login");
         }
         else{
           setSuccess(res.data.message || "Something Went Wrong!");
         }
    }
    catch(err){
        console.error("Internal Error", err);
        setSuccess("SignUp failed!");
    }

    setData({
      name: "",
      email: "",
      password: "",
    });

    setProfilePic(null);

    setTimeout(() => setSuccess(""), 5000);
  };

  console.log("profile pic", profilePic);

  return (
    <div className="box">
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={submitData}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="your name.."
          name="name"
          value={data.name}
          onChange={changeData}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="your email.."
          name="email"
          value={data.email}
          onChange={changeData}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="your password.."
          name="password"
          value={data.password}
          onChange={changeData}
        />

        <label htmlFor="profilePic">ProfilePic:</label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          onChange={handlefileChange}
        />

        {profilePic instanceof Blob && (
           <img src={URL.createObjectURL(profilePic)} alt="Preview" 
            style={{height:"100px" , width:"100px", marginTop:"10px"}} />
        )}

        <button type="submit">SignUp</button>
      </form>
      <p>
        <span>
          <Link to="/login">Login</Link>{" "}
        </span>
        if already have an acc!
      </p>
    </div>
  );
}
