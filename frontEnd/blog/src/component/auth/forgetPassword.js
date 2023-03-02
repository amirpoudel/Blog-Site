import axios from "axios";
import { useState } from "react";

let isUserPresent=false;

export default function ForgetPassword(props) {


    console.log(props);
  let url = process.env.REACT_APP_URL;
  if(props.access=='user'){
    url = process.env.REACT_APP_URL+"forgetPassword";
  }
  if(props.access=='admin'){
    url = process.env.REACT_APP_URL+"admin/login";
  }
  console.log(url);

    const [email,setEmail] = useState("");

    //send email to backend

    async function sendEmailRequest(){
        try {
            console.log(email);
            const res  = await axios.post(url,{email:email});
            console.log("Response",res.status);
            if(res.status==200){
                isUserPresent = true;
                
            }
        } catch (error) {
            console.log("Error" , error.response.data.message);
        }
       
       
    }


    const onSubmitHandle = ()=>{
        sendEmailRequest();
    }

    const onChangeHandle = (event)=>{
        setEmail(event.target.value);
        console.log(email);
    }
  return (
    <>
      <div className="login-container">
        <div className="form">
          <h1>Find Your Account</h1>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter Your Email"
              value={email}
              onChange={onChangeHandle}
            />
          </div>

          <button className="btn" onClick={onSubmitHandle}>Next</button>

        </div>
        
      </div>
    </>
  );
}
