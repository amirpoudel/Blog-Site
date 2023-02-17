



import axios from "axios";
import React,{useEffect, useReducer, useState} from "react";
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";


axios.defaults.withCredentials = true;

let firstRender = true;

export default function Admin(){

    let url  = process.env.REACT_APP_URL;
    const dispatch = useDispatch();
    
    const {isLoggedIn} = useSelector(state=>state.authentication);
    console.log(isLoggedIn);
    
    const [admin,setAdmin] = useState();
    const [allUsers,setAllUsers] = useState([]);//storing all users data
    
    const [total_post,setTotalPost] = useState();
    const [total_visits,setTotalVisits]  = useState();
  
    async function refreshToken(){
        const res = await axios.get(url+'refreshToken',{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
        // if(!res){
        //     return null;
        // }
        const data = await res.data;
        return data;
    }
    
    async function sendRequest(){
        const res = await axios.get(url+'admin',{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
        if(!res){
            return null;
        }
        const data = await res.data;
        return data; 
    }

    async function sendRequestToGetUsers(){
        const res = await axios.get(url+'admin/allUsers',{withCredentials:true}).catch((err)=>{
            console.log(err);
        })
        if(!res){
            return null;
        }
        const data = await res.data;
        return data;
    }
    async function getTotalPosts(){
        try {
            const res = await axios.get(url+'admin/totalPosts',{withCredentials:true})
            console.log(res.data);
            setTotalPost(res.data.totalPosts);
        } catch (error) {
            console.log(error)
        }
        
    }

    async function getTotalVisits(){
        try {
            const res = await axios.get(url+'admin/totalVisits',{withCredentials:true});
            console.log(res.data);
            setTotalVisits(res.data.totalVisits);

        } catch (error) {
            console.log(error);
        }
        
    }

    async function logoutRequest(){
        const res = await axios.post(url+"logout",{withCredentials:true}).catch((err)=>{
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

    useEffect( ()=>{
        if(firstRender){
            firstRender = false;
            sendRequest().then((data)=>{
                if(!data){
                    console.log(data)
                    return;
                }
                console.log(data.admin);
                setAdmin(data.admin);
               })

               
        }
        sendRequestToGetUsers().then((data)=>{
            if(!data){
                console.log(data)
                return;
            }
            setAllUsers(data.allUsers);
            console.log(data.allUsers);
            

        })

         getTotalPosts();

         getTotalVisits();
        
        let interveral = setInterval(()=>{
            refreshToken().then((data)=>{
                setAdmin(data.admin);
            })
        },1000*1000*55)

       return ()=>clearInterval(interveral);       
    },[])

    return (<>
            {console.log(admin)}
            <h2>Welcome Admin</h2>
            {admin && <h1>{admin.name}</h1>}
            {admin && <p>{admin.email}</p>}
           {
           admin && <Link to="/">
          <button className="secondary-button" onClick={logoutHandle}>Log out</button>
          </Link>
           }    
            <h1>Total Site Visits - {total_visits}</h1>
            <h1>Total Posts - {total_post}</h1>
             <h1>Users - {allUsers.length}</h1>
           
             
         {
            admin && allUsers && allUsers.map((user)=>{
                return(<>
                    <h3>
                        {user.name}
                        -<p>{user.email}</p>
                    </h3>
                </>)
            })
           }



           
         
            
    </>)
}