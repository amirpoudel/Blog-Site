import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./singleArticle.css";
import ShowComment from "./showComment";
import {FacebookShareButton,TwitterShareButton,WhatsappShareButton,LinkedinShareButton, FacebookIcon, TwitterIcon, LineIcon, WhatsappIcon, LinkedinIcon} from "react-share";

export default function SingleArticle(props) {



  let { id } = useParams();//this hold post id ;


  //state
  const [comment,SetComment]  = useState("");
  const [article, setArticle] = useState();

  let url = "http://localhost:5000/";

  // const shareUrl = url + "article/" + id;
   const shareUrl = 'https://www.hamrokhelkud.com/cricket/128625.html'
  
  async function sendRequest() {
    let articleUrl = url + "article/" + id;
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
  async function postCommentRequest(){
    let commentUrl = url+"post/comment/"+id;
    console.log(comment)
    const res =await  axios.post(commentUrl,{comment:comment},{withCredentials:true}).catch((err)=>{
      console.log(err);
      
    })
    console.log("Response in frontEnd",res);
    if(!res){
      //if error or res is undefined 
     return null
    }

    return res.data;

    

  }

  //Event Handling
  function handleOnChangeComment(event){
    SetComment(event.target.value);
    console.log(comment);
  }

  function handleSubmitComment(){
    if(comment.length>0){
      postCommentRequest().then((data)=>{
        
        console.log(data);
        if(data==null){
          alert("Please Login To Comment");
        }
      })
    }else{
      console.log("Enter Comment");
    }
    

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
     
        {article && <h2>Title: {article.title}</h2>}

        {article && (
          <img
            src={url + article.imagePath}
            className="img-fluid"
            alt="Responsive image"
          ></img>
        )}

        {article && <h3>{article.body}</h3>}
        {article && (
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Comment</span>
            </div>
            <textarea onChange={handleOnChangeComment} value={comment}
              className="form-control"
              aria-label="With textarea"
            ></textarea>
            <button type="button" className="btn btn-primary" onClick={handleSubmitComment}>
              Submit
            </button>
          </div>
        )}

        {article && <div>
          <h4>Social Share</h4>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={40}/>
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={40}/>
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={40}/>
          </LinkedinShareButton>
          
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={40}/>
          </WhatsappShareButton>
          </div>}
        
        {article && 
          <div>
            <h2>Comments</h2>
            <ShowComment comments = {article.comments}/>
          </div>
        }
       
        
        
      </div>
    </>
  );
}
