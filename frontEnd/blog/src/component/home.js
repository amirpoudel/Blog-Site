import "./home.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ShowArticles from "./showArticles";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [info,setInfo] = useState({});//store all user infromation

  let url = "http://localhost:5000/"
//Sending Request To Backend
  async function sendRequest() {
    const res = await axios.get("http://localhost:5000/").catch((err) => {
      console.log(err);
    });
    if (!res) {
      return null;
    }
    const data = await res.data;
    return data;
  }

//send info to backend

async function sendInfoRequest(){
 const location  = await locationInfo();
  console.log(location);
  localStorage.setItem("ip",`${location.ip}`);
  console.log(localStorage.getItem("ip"));
  

  const res  = await axios.post(url+"info",location);
  console.log(res);

}

  // request for get user location related infromation
  async function locationInfo(){
    const res = await axios.get("https://ipapi.co/json",{withCredentials: false});
    if(!res.data){
      return null;
    }
  
    return res.data;
  }

   

  useEffect(() => {
    sendRequest().then((data) => {
      if(data!=null){
        console.log(data.articles[0].author);
      console.log(data.articles);
      
      setArticles(data.articles);
      }else{
        console.log("Cannot Get Information from backend")
      }

      console.log("Loaded Home Page")

      if(!localStorage.getItem("ip")){
        sendInfoRequest();
      }
    });
   
    


  }, []);

  return (
    <>

      <div className="button-container">
        <Link to="/login">
          <button className="primary-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="secondary-button">Register</button>
        </Link>
      </div>

      
      <div className="container">
        <h1>Blogs</h1>
        <ShowArticles articles={articles} url = {url}/>
      </div>
    </>
  );
}
