

import axios from "axios";
import React,{useEffect, useReducer, useState} from "react";
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./post/createPost";

import ShowArticles from "../showArticles";

axios.defaults.withCredentials = true;

let firstRender = true;

export default function User(){

    let url  = 'http://localhost:5000/'
    const dispatch = useDispatch();
    
    const {isLoggedIn} = useSelector(state=>state.authentication);
    console.log(isLoggedIn);

    const [user,setUser] = useState();
  
    async function refreshToken(){
        const res = await axios.get('http://localhost:5000/refreshToken',{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
        // if(!res){
        //     return null;
        // }
        const data = await res.data;
        return data;
    }
    
    async function sendRequest(){
        const res = await axios.get('http://localhost:5000/user',{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
        if(!res){
            return null;
        }
        const data = await res.data;
        return data; 
    }

    async function logoutRequest(){
        const res = await axios.post("http://localhost:5000/logout",{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
       
        if(res.status==200){
            return res;
        }

        return new Error("Unable To Logout");
    }

    async function logoutHandle(){

        await logoutRequest().then((res)=>{
            if(res.status==200){
                console.log(res);
                dispatch({
                    type:"logout",
                    payload:false,
                })
            }else{
                console.log(res);
            }
        })
        
    }

    useEffect(()=>{
        if(firstRender){
            firstRender = false;
            sendRequest().then((data)=>{
                if(!data){
                    console.log(data)
                    return;
                }
                console.log(data.user);
                setUser(data.user);
               })

               
        }
        
        let interveral = setInterval(()=>{
            refreshToken().then((data)=>{
                setUser(data.user);
            })
        },1000*1000*55)

       return ()=>clearInterval(interveral);       
    },[])

    return (<>
            {console.log(user)}
            <h2>Welcome </h2>
            {user && <h1>{user.name}</h1>}
        
           {
           user && <Link to="/">
          <button className="secondary-button" onClick={logoutHandle}>Log out</button>
          </Link>
           }

           {
            user && <CreatePost author={{name:user.name}}/>
           }
           {/* {
            user && <UserPost articles={{posts:user.posts}}/>
           } */}
           {
            user && <ShowArticles articles={user.posts} url={url}/>
           }
    </>)
}