const database = require('../database/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const validator = require("email-validator");
const jwt = require('jsonwebtoken');

require('dotenv').config();

const date = new Date();

const tokenExpireTime = '1hr';

const registration = async (req, res) => {
    console.log("Data recieved for Registration");
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!validator.validate(email)) {
        console.log("Please Enter Valid Email");
        return res.status(403).json({ message: "Please Enter Verified Email" });

    }
    if (password !== confirmPassword) {
        console.log("Password Incorrect ");
        return res.status(403).json({ message: "Password Incorrect" });


    }


    const hashPassword = await bcrypt.hash(password, saltRounds);
    const databaseResponse = await database.createAdmin(name, email, hashPassword);
    console.log(databaseResponse);
    if (databaseResponse) {
        console.log("Email Already Register ");
        return res.status(403).json({message:"Email Already Register"});
    }
    console.log(hashPassword);
    console.log(name, email, password);
    return res.status(200).json({message:"Registration Sucessfull"});



}


const login = async (req, res) => {
    console.log("data recieved for login");
    const userName = req.body.userName;
    const password = req.body.password;
    const admin = await database.findAdminByEmail(userName);
    if (!admin) {
        console.log("No admin Found");
        return res.status(404).send("admin Not Found");
    }
    console.log(admin);
    //compare hash password with admin login password
    const matchPassword = await bcrypt.compare(password, admin.password);
    if (!matchPassword) {
        console.log("Password Doesnot Match !!!");
        return res.status(404).json({ message: "Password Doesnot Match" });;

    }
    
    //creating token 
    const token =  jwt.sign({ id: admin._id }, process.env.JWT_KEY, {expiresIn: tokenExpireTime });
    console.log("You Are Login Bro !!!! Enjoy !!!!!!");


   

    //if already cookies present remove that cookie
    let checkCookie = req.headers.cookie;
    console.log("Checking Cookie.......",checkCookie)
    if(req.cookies[`${admin._id}`]){
        req.cookies[`${admin._id}`]="";
    }

    //if there are two or more than different admins login cookies then remove it from loop

    if(checkCookie){

    let cookieArray = req.headers.cookie.split(';');
    console.log(cookieArray);
    cookieArray.forEach((cookie)=>{
        let key  = cookie.trim().split('=')[0];
        if(req.cookies[`${key}`]){//if admin cookie already present then remove it
            console.log("This cookie already present",key)
            //req.cookies[`${key}`]="";
            res.clearCookie(`${key}`,{path:'/'});
            return;
        }
    })
    }



    //set cookies to response
    res.cookie(String(admin._id), token, { path: "/", expires: new Date(Date.now() + 1000 * 1000* 60), httpOnly: true, sameSite: 'lax' });

    console.log(admin._id);
    return res.status(200).json({message:'Successfully Logged In',token});

}


const verifyToken = (req, res, next) => {

    //geeting cookies from frontEnd
    const cookies = req.headers.cookie;
   // console.log("THIS IS COOKIES",req.headers.cookie);
    if(!cookies){
        console.log("No cookies Bro !!!!!!!");
        return res.status(404).json({message:"Cannot get information"});
        
    }
    
    const token = cookies.split("=")[1];
    console.log(token);
    if (!token) {
        return res.status(404).json({ message: "No Token found" });

    }
    jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" })
        }

        console.log(user.id);
        //set request id 
        req.id = user.id;
    })
    console.log("Token Verify Bro !!!");
    //go to next function in router
     next();
}

const refreshToken = async(req,res,next)=>{
    const cookies = req.headers.cookie;
    let prevToken;
    if(typeof cookies ==='string'){
         prevToken  = cookies.split("=")[1];//slipt headers from token
    }

    if(!prevToken){
        return res.status(400).json({message:"No Token found"})
    }

    jwt.verify(String(prevToken),process.env.JWT_KEY,(err,decode)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"})
        }

        //clear cookies from response
        res.clearCookie(`${decode.id}`);
        //clear cookies from headers
        req.cookies[`${decode.id}`]="";

        //generate new token 
        const newToken = jwt.sign({id:decode.id},process.env.JWT_KEY, { expiresIn: tokenExpireTime });
        
        //set new Token to cookie
        res.cookie(String(decode.id),newToken,{
            path:"/",
            expires:new Date(Date.now()+1000*1000*60),
            httpOnly:true,
            sameSite:'lax',
        })

        //set request id to user id
        req.id = decode.id;
        console.log("Refresh TOken Successfull Bro ");
        next();

    })

    
}


module.exports={
    registration:registration,
    login:login,
    verifyToken:verifyToken,
    refreshToken:refreshToken,
}

