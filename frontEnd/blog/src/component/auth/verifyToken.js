import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyToken(props) {
  let url = process.env.REACT_APP_URL;
  let resetPasswordUrl = '/resetPassword';
  if (props.access == "user") {
    url = process.env.REACT_APP_URL + "forgetPassword/verifyToken";
  }
  if (props.access == "admin") {
    url = process.env.REACT_APP_URL + "admin/forgetPassword/verifyToken";
    resetPasswordUrl = '/admin/resetPassword';
  }

  const [token, setToken] = useState("");

  const navigate = useNavigate();
  // send request for token


  async function sendTokenRequest() {
    try {
      const response = await axios.post(url,{token:token,email:localStorage.getItem('email')});;//get email from local storage
      console.log(response);
      if(response.status==200){
        navigate(resetPasswordUrl)
      }
    } catch (error) {
      console.log(error);
      if(error.response.status==400){
        alert("Token Doesnot Match!!");
      }
    }
  }

  const onChangeHandle =  (event) =>{
    setToken(event.target.value);
    console.log(token);
  };

  const onSubmitHandle = ()=>{
    console.log(token);
    sendTokenRequest();
  };

  return (
    <>
      <div className="login-container">
        <div className="form">
          <h1>Enter Your Token</h1>
          <p>please check your email for token</p>
          <div className="form-group">
            <label htmlFor="token">Token</label>
            <input
              type="text"
              id="token"
              name="token"
              placeholder="Enter Your 4 digit token"
              value={token}
              onChange={onChangeHandle}
            />
          </div>

          <button className="btn" onClick={onSubmitHandle}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
