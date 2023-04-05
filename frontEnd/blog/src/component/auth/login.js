import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Stack,
  Link
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login(props) {
  const dispatch = useDispatch();
  console.log(props);
  let url = process.env.REACT_APP_URL;
  let forgetPasswordUrl = "/forgetPassword";
  if (props.access == "user") {
    url = process.env.REACT_APP_URL + "login";
  }
  if (props.access == "admin") {
    url = process.env.REACT_APP_URL + "admin/login";
    forgetPasswordUrl = "../admin/forgetPassword";
  }
  console.log(url);
  console.log(`${process.env.REACT_APP_URL}`);

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
  };

  const submitHandle = () => {
    console.log(credential);
    submit().then((data) => {
      console.log(data.message);
      
      toast.success('Login Succesfully !', {
        position: toast.POSITION.TOP_RIGHT
    });
      navigate(`/${props.access}`);
    });
  };

  return (
    <>
      <Box sx={{p:5, width:'30rem',m:'auto'}}>
        <Typography>{`${props.access.toUpperCase()} Login`}</Typography>
        <Stack spacing={1}>
          <TextField
            
            label="Username"
            multiline
            maxRows={4}
            id="userName"
            name="userName"
            value={credential.userName}
            onChange={onChangeHandle}
          />
          <TextField
            
            label="Password"
            type="password"
            autoComplete="current-password"
            id="password"
            name="password"
            value={credential.password}
            onChange={onChangeHandle}
          />

          <Link
            component="button"
            variant="body2"
            onClick={() => {
              navigate(forgetPasswordUrl);
            }}
          >
            Forget Password ?
          </Link>

          <Button variant="outlined" onClick={submitHandle}>
            Login
          </Button>
          <Typography>Are You Register?</Typography>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Stack>
      </Box>

      <div className="login-container">
        <div className="form">
          <h1></h1>
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
          <Button variant="outlined" onClick={submitHandle}>
            Login
          </Button>
          <Typography>Are You Register?</Typography>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Sign Up
          </Button>

          <ToastContainer/>
        </div>
      </div>
    </>
  );
}
