import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { redirect,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";



export default function Login(props) {

  const dispatch = useDispatch();
  console.log(props);
  let url = process.env.REACT_APP_URL;
  if(props.access=='user'){
    url = process.env.REACT_APP_URL+"login";
  }
  if(props.access=='admin'){
    url = process.env.REACT_APP_URL+"admin/login";
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
    //const url = "http://localhost:5000/login";
    // const data = {
    //     user : userName,
    //     password : password
    // }
    const res = await axios.post(url, credential).catch((err) => {
        console.log(err);
      });

      return res.data;
     
  }

  //event handling

  // const onChangeHandleUserName = (event)=>{
  //    // setUserName(event.target.value);
  //    setCredential(event.target.value);
  //     console.log(event.target.value)
  // }
  // const onChangeHandlePassword  = (event)=>{
  //     //setPassword(event.target.password);
  //     setCredential(event.target.value);
  //     console.log(event.target.value);
  // }

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
      {/* <div className='container mt-5'>


            <div className="mb-3 row">
                <label htmlFor="userName" className="col-sm-2 col-form-label">
                    Email
                </label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        value={credential.userName}
                        className="form-control"
                        id="userName"
                        onChange={onChangeHandle}
                        
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">
                    Password
                </label>
                <div className="col-sm-10">
                    <input type="password" className="form-control" id="password" value={credential.password} onChange={onChangeHandle} />
                </div>
            </div>
            <button type="button"  onClick={submitHandle} className="btn btn-primary">
                Submit
            </button>
        </div> */}
      //Generate By Chat GPT
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
          <button type="submit" className="btn" onClick={submitHandle}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
