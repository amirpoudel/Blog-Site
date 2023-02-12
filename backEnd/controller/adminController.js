const database = require('../database/database');






require('dotenv').config();




const getAdmin = async (req,res)=>{
    const adminId = req.id; //get id from verify token
    console.log("Getting All the information Related Admin",adminId);
    try {
        let admin = await database.findAdminById(adminId);
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



module.exports={
    getAdmin:getAdmin,
    getAllUsers:getAllUsers,
}

