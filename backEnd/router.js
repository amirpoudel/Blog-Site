
const express = require('express');
const { verifyToken } = require('./controller/userController');
const userController = require('./controller/userController');
const globalController = require('./controller/globalController')
const router = express.Router();
const {upload} = require('./controller/fileController');// multer storage....
const adminController = require('./controller/adminController');
const authController = require('./controller/authController');
//home page
// router.get("/",(req,res)=>{
//     res.send("Hello World From Just Another Sever")
// })

router.get("/",globalController.getArticles)


//Handle Request From Admin

router.post("/admin/register",authController.registration);
router.post("/admin/login",authController.login);
router.get("/admin",authController.verifyToken,adminController.getAdmin);
router.get("/admin/allUsers",authController.verifyToken,adminController.getAllUsers);
//router.post("/admin",authController.verifyToken);


//Handle request From User Site
router.post("/login",authController.login)
router.post("/register",authController.registration);
router.get("/user",authController.verifyToken,userController.getUser);
router.get("/refreshToken",authController.refreshToken,authController.verifyToken,userController.getUser)
router.post("/logout",authController.logout)
//request for create post
router.post("/user/post-article",authController.verifyToken,upload.single('image'),userController.postArticle);
//request for comment on post
router.post("/post/comment/:articleId",authController.verifyToken,userController.postComment);


//request for single article from home page with out login
router.get("/article/:articleId",globalController.getSingleArticle);
//request for single article from user page after user login -
router.get("/user/article/:articleId",authController.verifyToken,userController.getSingleArticle);

 module.exports = router;
