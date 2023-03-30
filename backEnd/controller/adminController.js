const database = require('../database/database');

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Socket } = require('dgram');

const app = express();
const httpServer = createServer(app);

httpServer.listen(4000);
const io = new Server(httpServer, { cors:{
    origin:"*"
} });
require('dotenv').config();



//data testing 

let article = {
    author:"Amir Poudel",
    views:"2M"
}
let user = 0;
//this function is under construction
function socketConnection(){
    
    io.on('connection',(socket)=>{
        console.log("User Connected");
        console.log("Socket ID",socket.id);
        user++;
        socket.send(article)
        io.emit("broadcast",{user});
        console.log(`${user} user are connected`)
    //    database.watchPostChange(broadcastData);//passing function 
       
    //     function broadcastData(data){
    //         console.log(data);
    //         console.log("Calling function ");
    //         socket.send(data);
    //     }
        
  
     
        socket.on('disconnect',function(){
            user--;
            io.emit("broadcast",{user});
            console.log("user disconnected");
            console.log(`${user} user are connected`)
        })

    })}


const getAdmin = async (req,res)=>{
    const adminId = req.id; //get id from verify token
    console.log("Getting All the information Related Admin",adminId);
    try {
        let admin = await database.findAdminById(adminId);
        //established socket 
        socketConnection();
        database.watchPostChange()
        
        return res.status(200).json({admin});
    } catch (error) {
        return res.status(400).json({message:"please try again ! "});
    }
}

const getAllUsers = async (req,res)=>{
    try {
        let allUsers = await database.findAllUsers();
        console.log(allUsers);
        return res.status(200).json({allUsers});
    } catch (error) {
        return res.status(500).json({message:"unable to get all users"});
    }
}

const getTotalPosts = async(req,res)=>{
    try {
        let totalPosts = await database.totalPosts();
        console.log("Total Posts is ",totalPosts);
        return res.status(200).json({totalPosts});
    } catch (error) {
        
    }
}

const getTotalVisits = async (req,res)=>{
    
    try {
        let totalVisits = await database.totalVisits();
        console.log("Total Visits In Site ",totalVisits);
        return res.status(200).json({totalVisits});
    } catch (error) {
        
    }

}



module.exports={
    getAdmin:getAdmin,
    getAllUsers:getAllUsers,
    getTotalPosts:getTotalPosts,
    getTotalVisits:getTotalVisits,
}

