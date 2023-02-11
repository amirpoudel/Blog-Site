const database = require('../database/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const validator = require("email-validator");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage')
const { use, head, post } = require('../router');
const { reset } = require('nodemon');
require('dotenv').config();

const date = new Date();

const tokenExpireTime = '1hr';

//creating local storage for multer



//create storage for upload post images----
// let url = 'mongodb://localhost:27017/movie-streaming'
// let postsUrl  = url+'/posts'
// const storage  = new GridFsStorage({postsUrl});
// const upload = multer({storage});


const login = async (req, res) => {
    console.log("data recieved for login");
    const userName = req.body.userName;
    const password = req.body.password;
    const user = await database.findUserByEmail(userName);
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
    const databaseResponse = await database.createUser(name, email, hashPassword);
    console.log(databaseResponse);
    if (databaseResponse) {
        console.log("Email Already Register ");
        return res.status(403).json({message:"Email Already Register"});
    }
    console.log(hashPassword);
    console.log(name, email, password);
    return res.status(200).json({message:"Registration Sucessfull"});



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


const getUser = async (req, res, next) => {

    const userId =req.id //we recieve from previous function after verify token;
    console.log(typeof userId)
    console.log(userId);
    let user;
    try {
        user = await database.findUserById(userId); 
        console.log(user);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(404).json({ message: "User Not Found" });
        //return new Error(err);

    }
   
   

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


const postArticle = async (req,res)=>{
   
    const userId =req.id //we recieve from previous function after verify token;

    console.log("user Id",userId);
    console.log(typeof userId)
    console.log("incomming File.......",req.file);
    console.log("incomming request.......",(req.body.post));
    console.log(typeof req.body.post)


    const data = JSON.parse(req.body.post);//the data came from data form so parse string ;
    console.log(typeof data);
    console.log("Data After parser....",data);
 

    //getting image from uploads folder
    let imagePath ;
    if(req.file){
        imagePath = req.file.path;
    }else{
        imagePath = null;
    }
    
    //const imageBinaryData = fs.readFileSync(imagePath);
    data.imagePath = imagePath
    console.log(data.imagePath);

    data.authorId = userId
    const databaseResponse = await database.createPost(data);
    console.log(databaseResponse);
    if(databaseResponse){
        console.log("Could Not post data");
        return res.status(500).json({message:"Could not sumbit data please try again !!"});
    }
    console.log(data);
    
    let postId = 100;
    //await database.update_user_postId(userId,postId);
    console.log("Post Sumbit Sucessfully");
    //after upload image in database delete image from upload file
    
    return res.status(200).json({message:"Post Sumbit Sucessfully"});

}
const postComment = async (req,res)=>{

    const userId = req.id // after verifty token;

    console.log("USER ID",userId);
    console.log("Incomming parameters",req.params);
    console.log("Incomming Body ",req.body.comment);
    
    const articleId = req.params.articleId;
    const comment = req.body.comment;
    //post comment
    try {
        const response = await database.createComment(userId,articleId,comment);
        console.log(response);
       return res.status(200).json({message:"Comment submit "});
    } catch (error) {
        console.log(error);
        return res.status(404).json({message:"Couldn't Post Comment"});
    }
   

    


}

const getSingleArticle = async (req,res)=>{


    console.log("Incomming request for article",req.params);
    const articleId = req.params.articleId;
    try {
        const article = await database.getSingleArticle(articleId);
        return res.status(200).json({article});
    } catch (error) {
        
    }

}



module.exports = {
    registration: registration,
    login: login,
    verifyToken: verifyToken,
    refreshToken:refreshToken,
    getUser: getUser,
    logout:logout,
    postArticle: postArticle,
    getSingleArticle:getSingleArticle, 
    postComment:postComment,
};