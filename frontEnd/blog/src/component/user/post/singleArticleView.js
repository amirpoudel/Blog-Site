import axios from "axios";

import React,{ useEffect, useState } from "react";
import {  useParams,useNavigate } from "react-router-dom";
import "./singleArticleView.css";
import ShowComment from "../../showComment";


export default function SingleArticleForUser(props) {

  const navigate = useNavigate();

  let { id } = useParams();//this hold post id ;


  //state
 
  const [article, setArticle] = useState();

  let url = "http://localhost:5000/";

  async function sendRequest() {
    let articleUrl = url + "user/article/" + id;
    let res = await axios.get(articleUrl).catch((err) => {
      console.log(err);
    });

    if (!res) {
      //undefined
    }
    if (res.status != 200) {
      console.log("Couldn't get data from backend");
      return null;
    }

    return res.data;
  }
 

  //------------------ Event Handling------------------------------

  async function deleteHandle(){

    const res  = await axios.delete(`${url}post/${id}`,{withCredentials:true});
    alert(res.data.message);
    navigate("/user");

  }
 
  

  


  useEffect(() => {
    sendRequest().then((data) => {
      if (data != null) {
        console.log(data.article);
        setArticle(data.article);
      }
    });
  }, []);

  return (
    <>
      <div className="container">
        <h3>Hello World</h3>
        {article && <h2> ID:{id}</h2>}
        {article && <h2>Views : {article.views}</h2>}
        {article && <h2>Title: {article.title}</h2>}

        {article && (
          <img
            src={url + article.imagePath}
            className="img-fluid"
            alt="Responsive image"
          ></img>
        )}

        {article && <h3>{article.body}</h3>}
        
        
        {article && 
          <div>
            <h2>Comments</h2>
            <ShowComment comments = {article.comments}/>
          </div>
        }
        {
          article && 
          <button type="button" className="btn btn-delete btn-danger" onClick={deleteHandle} >Delete</button>
        }
       
        
        
      </div>
    </>
  );
}
