import axios from "axios";
import { useState } from "react"


export default function ResetPassword(props){


    let url = process.env.REACT_APP_URL;
  if (props.access == "user") {
    url = process.env.REACT_APP_URL + "resetPassword";
  }
  if (props.access == "admin") {
    url = process.env.REACT_APP_URL + "admin/resetPassword";
  }


    const [password,setPassword] = useState({
        newPassword:"",
        confirmPassword:"",
    })
    //send password reset request
   async function sendPasswordResetRequest(){

        try {
            const res = await axios.post(url,password,{withCredentials:true});
            console.log(res);
            if(res.status==200){
                alert("Password reset successfull");
            }
            
        } catch (error) {
            console.log("Error",error);
        }

        

    }

    const onChangeHandle = (event)=>{

        const newPassword = { ...password };

        newPassword[event.target.id] = event.target.value;
        setPassword(newPassword);


        console.log(newPassword);
    }

    const onSubmitHandle = ()=>{
        sendPasswordResetRequest();
    }

    return(
        <>
             <div className="login-container">
        <div className="form">
          <h1>Enter Your New Password</h1>
          <p>Don't forget next time</p>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="text"
              id="newPassword"
              name="newPassword"
              placeholder="Enter Your new password"
              value={password.newPassword}
              onChange={onChangeHandle}
            />
            
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="text"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-Enter your password"
              value={password.confirmPassword}
              onChange={onChangeHandle}
            />
            
          </div>

          <button className="btn" onClick={onSubmitHandle}>
            submit
          </button>
        </div>
      </div>
        </>
    )
}