
import React, { useState } from "react";
import axios from 'axios';
import './register.css'
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function Register(props) {
    const navigate = useNavigate();

    let url = process.env.REACT_APP_URL

    if(props.access=='user'){
        url = process.env.REACT_APP_URL+"register";
      }
      if(props.access=='admin'){
        url = process.env.REACT_APP_URL+"admin/register";
      }
      console.log(url);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    
    function resetForm(){
       window.location.reload(true);
    }
    //--------axios request

    async function submit() {
        //const url = 'http://localhost:5000/register';
        
        axios.post(url, user).catch((err) => {
            console.log(err);
            alert(err.response.data.message)
        });
    }


    const onChangeHandle = (event) => {
        const newUser = { ...user };

        newUser[event.target.id] = event.target.value;
        setUser(newUser);



        console.log(event.target.value);
        console.log(event.target.id)
    }

    const submitHandle = () => {
        console.log(user)
        submit().then(()=>{
           alert("Registration Successfull"); 
           resetForm();
        });
        

    }

    return (<>
        <div className='login-container'>

            <div className="form">
                
            <h1>Register</h1>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={user.name} onChange={onChangeHandle} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={user.email} onChange={onChangeHandle} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={user.password} onChange={onChangeHandle} />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={onChangeHandle} />
                </div>
                <Button variant="outlined" onClick={submitHandle}>
                    Sign Up
                </Button>
                <Typography>
                    Alerady Register? 
                </Typography>
                <Button variant="outlined" onClick={()=>navigate('/login')}>Login</Button>
            </div>
        </div>

    </>)

}