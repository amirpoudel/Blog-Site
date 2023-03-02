
// authentication and authorization for user and admin

const database = require("../database/database");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const validator = require("email-validator");
const jwt = require('jsonwebtoken');

const sendMail = require('../controller/sendEmail');

require('dotenv').config();




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
    let databaseResponse ;
    console.log(req.url)

    if(req.url=='/register'){
        databaseResponse = await database.createUser(name, email, hashPassword);
    }
    if(req.url=='/admin/register'){
        databaseResponse = await database.createAdmin(name,email,hashPassword);
    }
     
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
    
    console.log(req.url);
    console.log(typeof req.url)
    
    const userName = req.body.userName;
    const password = req.body.password;
    let user ;
    if(req.url=='/login'){
       user =  await database.findUserByEmail(userName);
    }
    if(req.url=='/admin/login'){
        user = await database.findAdminByEmail(userName);
    }
  
    if (!user) {
        console.log("No User Found");
        return res.status(404).send("User Not Found");
    }
    console.log(user);
    //compare hash password with user login password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        console.log("Password Doesnot Match !!!");
        return res.status(404).json({ message: "Password Doesnot Match" });;

    }
    
    //creating token 
    const token =  jwt.sign({ id: user._id }, process.env.JWT_KEY, {expiresIn: tokenExpireTime });
    console.log("You Are Login Bro !!!! Enjoy !!!!!!");


   

    //if already cookies present remove that cookie
    let checkCookie = req.headers.cookie;
    console.log("Checking Cookie.......",checkCookie)
    if(req.cookies[`${user._id}`]){
        req.cookies[`${user._id}`]="";
    }

    //if there are two or more than different users login cookies then remove it from loop

    if(checkCookie){

    let cookieArray = req.headers.cookie.split(';');
    console.log(cookieArray);
    cookieArray.forEach((cookie)=>{
        let key  = cookie.trim().split('=')[0];
        if(req.cookies[`${key}`]){//if user cookie already present then remove it
            console.log("This cookie already present",key)
            //req.cookies[`${key}`]="";
            res.clearCookie(`${key}`,{path:'/'});
            return;
        }
    })
    }



    //set cookies to response
    res.cookie(String(user._id), token, { path: "/", expires: new Date(Date.now() + 1000 * 1000* 60), httpOnly: true, sameSite: 'lax' });

    console.log(user._id);
    return res.status(200).json({message:'Successfully Logged In',token});

}

function randomTokenGenerator(){

    //return 4 digits random number
    let min = 1111;
    let max = 9999;
    return Math.floor(Math.random() * (max - min) + min);


}

let tokenValue ;

const forgetPassword = async (req,res)=>{

    console.log("data recieved for Forget Password");
    const email  =  req.body.email;
    console.log(email);
    let databaseResponse;
    if(req.url=='/forgetPassword'){
      databaseResponse = await database.findUserByEmail(email);
      console.log(databaseResponse)
      
      
    }
    if(req.url=='/admin/forgetPassword'){
        //databaseResponse = await database.createAdmin(name,email,hashPassword);
    }
    // if user not found 
    if(!databaseResponse){
        return res.status(400).json({message:"User Not Found"});
    }
    console.log("User Is Present")
    //after user found - send token on email 
     tokenValue = randomTokenGenerator();
     console.log(tokenValue)
     sendMail.sendTokenMail(email,tokenValue);


    return res.status(200).json({message:"User Found"});


    


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


const logout = async (req,res)=>{
    const cookies = req.headers.cookie
    if(!cookies){
        console.log(cookies,"No Cookies Coming From FrontEnd");
        return res.status(403).json({message:"You Are Not Authorized"});
    }
    const token = cookies.split("=")[1];
    if(!token){
        return res.status(400).json({message:"No Token"})
    }
    jwt.verify(token,process.env.JWT_KEY,(err,decode)=>{
        if(err){
            return res.status(403).json({message:"Unable to Logout"})
        }
        res.clearCookie(`${decode.id}`);
        req.cookies[`${decode.id}`] = ""
        console.log("Logout Succesfully")
        return res.status(200).json({message:"Successfully Logout"});
    })
}

module.exports={
    registration:registration,
    login:login,
    forgetPassword:forgetPassword,
    verifyToken:verifyToken,
    refreshToken:refreshToken,
    logout:logout,

}