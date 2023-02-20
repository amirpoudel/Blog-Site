import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./post/createPost";

import ShowArticles from "../showArticles";
import "./user.css";
axios.defaults.withCredentials = true;

let firstRender = true;

let url = "http://localhost:5000/";

export default function User() {
  
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.authentication);
  console.log(isLoggedIn);

  const [user, setUser] = useState();
  const [profileImage,setProfileImage] = useState();

  let formData = new FormData();
  if(profileImage){
    formData.append("profileImage",profileImage,"img.jpg");

  }
  console.log(formData);

//--------------------------Request To BackEnd---------------------------


  //function to send updated image data 
  async function updateProfilePic(){
   
    const res = await axios.put(url+'user/updateProfilePic',formData,{withCredentials:true});

    console.log(res);


  }


  async function refreshToken() {
    const res = await axios
      .get("http://localhost:5000/refreshToken", { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });
    // if(!res){
    //     return null;
    // }
    const data = await res.data;
    return data;
  }

  async function sendRequest() {
    const res = await axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });
    if (!res) {
      return null;
    }
    const data = await res.data;
    return data;
  }

  async function logoutRequest() {
    const res = await axios
      .post("http://localhost:5000/logout", { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });

    if (res.status == 200) {
      return res;
    }

    return new Error("Unable To Logout");
  }

  //-------------------------Event Handling----------------------

  async function logoutHandle() {
    await logoutRequest().then((res) => {
      if (res.status == 200) {
        console.log(res);
        dispatch({
          type: "logout",
          payload: false,
        });
      } else {
        console.log(res);
      }
    });
  }

  async function handleOnImageSubmit(){
        updateProfilePic();
  }

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      sendRequest().then((data) => {
        if (!data) {
          console.log(data);
          return;
        }
        console.log(data.user);
        setUser(data.user);
      });
    }

    let interveral = setInterval(() => {
      refreshToken().then((data) => {
        setUser(data.user);
      });
    }, 1000 * 1000 * 55);

    return () => clearInterval(interveral);
  }, []);

  return (
    <>
      {console.log(user)}
      {console.log(url+user)}
      <h2>Welcome </h2>
      {user && (
        <>
          {" "}
          <h1>{user.name}</h1> 
          
          <img id="profileImage"
                src={url+user.profileImagePath}
                className="card-img-top"
                alt="..."
              />
          <label htmlFor="image">Update Your Profile Picture</label>
          <input
            type="file"
            lable="Image"
            id="image"
            name="image"
            accept="image/*"
            onChange={(event)=>{
                setProfileImage(event.target.files[0]);
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOnImageSubmit}
          >Update</button>
          
          <br></br>
        </>
      )}

      {user && (
        <Link to="/">
          <button className="secondary-button" onClick={logoutHandle}>
            Log out
          </button>
        </Link>
      )}

      {user && <CreatePost author={{ name: user.name }} />}
      {/* {
            user && <UserPost articles={{posts:user.posts}}/>
           } */}
      {user && <ShowArticles articles={user.posts} url={url} />}
    </>
  );
}
