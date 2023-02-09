import "./home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ShowArticles from "./showArticles";

export default function Home() {
  const [articles, setArticles] = useState([]);

  let url = "http://localhost:5000/"

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

  useEffect(() => {
    sendRequest().then((data) => {
      if(data!=null){
        console.log(data.articles[0].author);
      console.log(data.articles);
      
      setArticles(data.articles);
      }else{
        console.log("Cannot Get Information from backend")
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
