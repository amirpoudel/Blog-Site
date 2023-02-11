import axios from "axios";
import { useState } from "react";

let postUrl = "http://localhost:5000/user/post-article";

export default function CreatePost({ author }) {
  const [post, setPost] = useState({
    author: author.name,
    title: "",
    body: "",
    category: "",
    subCategory: "",
  
  });

  const [image,setImage] = useState(null);

  async function sendPostRequest() {

    let formData = new FormData();
    if(image){
      formData.append("image",image,"img.jpg");
    }
    
    formData.append("post",JSON.stringify(post));
    
    
    console.log(formData);


   

    const res = axios.post(postUrl,formData,{
      
      withCredentials:true,
   
     
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((err) => {
        console.log(err);
      });

    return await res.data;
  }

  function handleOnChagne(event) {
    setPost({ ...post, [event.target.id]: event.target.value });

  
  }

  function handleOnSubmit() {
    console.log(post);
    console.log(image);
    sendPostRequest().then((data) => {
      console.log(data);
      console.log("Submit Sucessfully");
    });
  }

  function handleImageUpload(event) {
    setImage(event.target.files[0]);
  }

  return (
    <>
      <div>
        <h3>Create Post</h3>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Your Title"
            value={post.title}
            onChange={handleOnChagne}
          />
          <br />
          <label htmlFor="body">Post</label>
          <input
            type="text"
            id="body"
            placeholder="Enter Your Post"
            value={post.body}
            onChange={handleOnChagne}
          />
          <br />
          <label htmlFor="image">Image</label>
          <input
            type="file"
            lable="Image"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOnSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
