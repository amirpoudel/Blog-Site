import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link, redirect,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";



export default function Login(props) {

  const dispatch = useDispatch();
  console.log(props);
  let url = process.env.REACT_APP_URL;
  let forgetPasswordUrl = '/forgetPassword';
  if(props.access=='user'){
    url = process.env.REACT_APP_URL+"login";
  }
  if(props.access=='admin'){
    url = process.env.REACT_APP_URL+"admin/login";
    forgetPasswordUrl = '../admin/forgetPassword'
  }
  console.log(url);
  console.log(`${process.env.REACT_APP_URL}`)

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState({
    userName: "",
    password: "",
  });


  


  const navigate = useNavigate();

  //--------axios request

  async function submit() {
 
    const res = await axios.post(url, credential).catch((err) => {
        console.log(err);
      });

      return res.data;
     
  }

  

  const onChangeHandle = (event) => {
    const newCredential = { ...credential };

    newCredential[event.target.id] = event.target.value;
    setCredential(newCredential);

    console.log(event.target.value);
    console.log(event.target.id);
  };



  const submitHandle = () => {
    console.log(credential);
    submit().then((data)=>{
      console.log(data.message);
      //update the redux store
      dispatch({
        type:"login",
        payload:true,
      })
      

      navigate(`/${props.access}`)
      
      
    });
  };

  return (
    <>
      
      <div className="login-container">
        <div className="form">
          <h1>{`${props.access.toUpperCase()} Login`}</h1>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={credential.userName}
              onChange={onChangeHandle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credential.password}
              onChange={onChangeHandle}
            />
          </div>
          
          <Link to={forgetPasswordUrl}>Forget Password ?</Link>
          <button type="submit" className="btn" onClick={submitHandle}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
