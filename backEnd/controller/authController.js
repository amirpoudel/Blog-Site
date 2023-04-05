// authentication and authorization for user and admin
const fs  = require('fs');
const fsPromises = fs.promises;
const database = require("../database/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const sendMail = require("../controller/sendEmail");

require("dotenv").config();

const tokenExpireTime = "1hr";

const registration = async (req, res) => {
  

  const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body
  if (!validator.validate(email)) {
    console.log("Please Enter Valid Email");
    return res.status(403).json({ message: "Please Enter Verified Email" });
  }
  if (password !== confirmPassword) {
    console.log("Password not match  ");
    return res.status(403).json({ message: "Password  not match" });
  }

  const hashPassword = await bcrypt.hash(password, saltRounds);
  let databaseResponse;
  console.log(req.url);
  try {

    let folderPath;

    if (req.url == "/register") {
      databaseResponse = await database.createUser(name, email, hashPassword);
      folderPath = './uploads/users/'
    }
    if (req.url == "/admin/register") {
      databaseResponse = await database.createAdmin(name, email, hashPassword);
      folderPath = './uploads/admins/';
    }

    //when user/admin register then create folder;
    

    try {
      folderPath = folderPath+databaseResponse._id;
      await fsPromises.mkdir(folderPath,{recursive:true});
    } catch (error) {
      console.log(error)
    }

    console.log(hashPassword);
    console.log(name, email, password);
    console.log("Register Sucessfull broooooooooooooooooooooo")
    return res.status(200).json({ message: "Registration Sucessfull" });


  } catch (error) {
   // console.log(error.name);
    console.log( error.message);
    console.log("Error Showing Bro !")
    console.log("Email Already Register ");
    return res.status(403).json({ message: "Email Already Register" });
  }
  
 

 
  
};

const login = async (req, res) => {
  console.log(req.url);
  console.log(typeof req.url);

  const userName = req.body.userName;
  const password = req.body.password;
  let user;
  if (req.url == "/login") {
    user = await database.findUserByEmail(userName);
  }
  if (req.url == "/admin/login") {
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
    return res.status(404).json({ message: "Password Doesnot Match" });
  }

  //creating token
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: tokenExpireTime,
  });
  console.log("You Are Login Bro !!!! Enjoy !!!!!!");

  //if already cookies present remove that cookie
  let checkCookie = req.headers.cookie;
  console.log("Checking Cookie.......", checkCookie);
  if (req.cookies[`${user._id}`]) {
    req.cookies[`${user._id}`] = "";
  }

  //if there are two or more than different users login cookies then remove it from loop

  if (checkCookie) {
    let cookieArray = req.headers.cookie.split(";");
    console.log(cookieArray);
    cookieArray.forEach((cookie) => {
      let key = cookie.trim().split("=")[0];
      if (req.cookies[`${key}`]) {
        //if user cookie already present then remove it
        console.log("This cookie already present", key);
        //req.cookies[`${key}`]="";
        res.clearCookie(`${key}`, { path: "/" });
        return;
      }
    });
  }

  //set cookies to response
  res.cookie(String(user._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 60),
    httpOnly: true,
    sameSite: "lax",
  });

  console.log(user._id);
  return res.status(200).json({ message: "Successfully Logged In", token });
};

function randomTokenGenerator() {
  //return 4 digits random number
  let min = 1111;
  let max = 9999;
  return Math.floor(Math.random() * (max - min) + min);
}

let tokenValue;

const forgetPassword = async (req, res) => {
  console.log("data recieved for Forget Password");
  const email = req.body.email;
  console.log(email);
  let databaseResponse;
  if (req.url == "/forgetPassword") {
    databaseResponse = await database.findUserByEmail(email);
    
  }
  if (req.url == "/admin/forgetPassword") {
    databaseResponse = await database.findAdminByEmail(email);
  }


  console.log(databaseResponse);

  // if user not found
  if (!databaseResponse) {
    return res.status(400).json({ message: "User Not Found" });
  }
  console.log("User Is Present");
  //after user found - send token on email
  tokenValue = randomTokenGenerator();
  console.log(tokenValue);

  // if user request twice - delete previous token value
  await database.deleteTokenValue(email);

  await database.storeTokenValue(email, tokenValue);

  sendMail.sendTokenMail(email, tokenValue);

  return res.status(200).json({ message: "User Found" });
};

const verifyPasswordResetToken = async (req, res) => {
  console.log(req.body);
  const token = req.body.token;
  const email = req.body.email;

  //verify token and email

  const databaseResponse = await database.getTokenValue(email);
  //null response  === no present email
  if (!databaseResponse) {
    return res.status(400).json({ message: "Your are not that guy" });
  }
  console.log(databaseResponse);
  if (databaseResponse.token == token) {
    //token verify
    console.log("Token Verify Success , Now Reset Password");
    //generate jwt token

    const jwtToken = jwt.sign({ id: email }, process.env.JWT_KEY, {
      expiresIn: tokenExpireTime,
    });
    // if already reset jwtToken present then remove

    //if already cookies present remove that cookie
    let checkCookie = req.headers.cookie;
    console.log("Checking Cookie.......", checkCookie);
    if (req.cookies[`${email}`]) {
      req.cookies[`${email}`] = "";
    }

    //if there are two or more than different users login cookies then remove it from loop

    if (checkCookie) {
      let cookieArray = req.headers.cookie.split(";");
      console.log(cookieArray);
      cookieArray.forEach((cookie) => {
        let key = cookie.trim().split("=")[0];
        if (req.cookies[`${key}`]) {
          //if user cookie already present then remove it
          console.log("This cookie already present", key);
          //req.cookies[`${key}`]="";
          res.clearCookie(`${key}`, { path: "/" });
          return;
        }
      });
    }

    //set cookies to response
  res.cookie(String(email), jwtToken, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 60),
    httpOnly: true,
    sameSite: "lax",
  });

  console.log("Cookies Name is : ",email);
  return res.status(200).json({ message: "token verify , now reset password", jwtToken });



  }else{

    return res.status(400).json({message: "Token Invalid"});

  }
};



const resetPassword = async(req,res)=>{

    const email  = req.id ; // after verify token function ;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    console.log("Your password Reset Bro !",email);
    console.log(typeof email)

   

    if (newPassword !== confirmPassword) {
        console.log("Password Incorrect ");
        return res.status(403).json({ message: "Password Incorrect" });
      }
    
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    let databaseResponse;
    console.log(req.url);
    
      if (req.url == "/resetPassword") {
        databaseResponse = await database.resetUserPassword( email, hashPassword);
      }
      if (req.url == "/admin/resetPassword") {
       databaseResponse = await database.resetAdminPassword( email, hashPassword);
      }
    
    //after reset password delete token 
    database.deleteTokenValue(email);

      console.log(databaseResponse);
     
      console.log(hashPassword);
      console.log(email, newPassword);
      return res.status(200).json({ message: "Password Reset Successfull" });



    

}


const verifyToken = (req, res, next) => {
  //geeting cookies from frontEnd
  const cookies = req.headers.cookie;
  // console.log("THIS IS COOKIES",req.headers.cookie);
  if (!cookies) {
    console.log("No cookies Bro !!!!!!!");
    return res.status(404).json({ message: "Cannot get information" });
  }

  const token = cookies.split("=")[1];
  console.log(token);
  if (!token) {
    return res.status(404).json({ message: "No Token found" });
  }
  jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    console.log(user.id);
    //set request id
    req.id = user.id;
  });
  console.log("Token Verify Bro !!!");
  //go to next function in router
  next();
};

const refreshToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken;
  if (typeof cookies === "string") {
    prevToken = cookies.split("=")[1]; //slipt headers from token
  }

  if (!prevToken) {
    return res.status(400).json({ message: "No Token found" });
  }

  jwt.verify(String(prevToken), process.env.JWT_KEY, (err, decode) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }

    //clear cookies from response
    res.clearCookie(`${decode.id}`);
    //clear cookies from headers
    req.cookies[`${decode.id}`] = "";

    //generate new token
    const newToken = jwt.sign({ id: decode.id }, process.env.JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    //set new Token to cookie
    res.cookie(String(decode.id), newToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    //set request id to user id
    req.id = decode.id;
    console.log("Refresh TOken Successfull Bro ");
    next();
  });
};

const logout = async (req, res) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    console.log(cookies, "No Cookies Coming From FrontEnd");
    return res.status(403).json({ message: "You Are Not Authorized" });
  }
  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(400).json({ message: "No Token" });
  }
  jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
    if (err) {
      return res.status(403).json({ message: "Unable to Logout" });
    }
    res.clearCookie(`${decode.id}`);
    req.cookies[`${decode.id}`] = "";
    console.log("Logout Succesfully");
    return res.status(200).json({ message: "Successfully Logout" });
  });
};

module.exports = {
  registration: registration,
  login: login,
  forgetPassword: forgetPassword,
  verifyPasswordResetToken: verifyPasswordResetToken,
  resetPassword:resetPassword,
  verifyToken: verifyToken,
  refreshToken: refreshToken,
  logout: logout,
};
