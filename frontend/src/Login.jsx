import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from "./UserContext";
import axios  from "axios";

export default function Login() {

  const apiUrl = "https://notesapp-qobz.onrender.com";

  const navigate = useNavigate();
  const {setEmail} = useContext(UserContext);
  const {setProfilePic} = useContext(UserContext);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const changeData = (e) =>{
     const {name, value} = e.target;
     setData((preData)=>({
        ...preData,
        [name]:value
     }))
  }


  const submitData = (e) => {
  e.preventDefault();

  axios.post(`${apiUrl}/api/user/login`, data)
    .then((user) => {
      if (user.data.message === "Login Successful") {
        const userInfo = user.data.user;

        setEmail(userInfo.email); 
        setProfilePic(userInfo.profilePic); 

        navigate("/note");
        console.log("logged successful", user.data);
      } else {
        console.log("Internal Error");
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      alert("Login failed. Check email and password.");
    });

  setData({
    email: "",
    password: ""
  });
};


  return (
    <div className="box">
      <form onSubmit={submitData}>
       

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

        <button type="submit">Login</button>
      </form>
      <p><span><Link to= "/">SignUp</Link> </span>if not have an acc!</p>
    </div>
  );
}
