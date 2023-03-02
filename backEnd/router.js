
const express = require('express');
const { verifyToken } = require('./controller/userController');
const userController = require('./controller/userController');
const globalController = require('./controller/globalController')
const router = express.Router();
const {upload,profilePic} = require('./controller/fileController');// multer storage....
const adminController = require('./controller/adminController');
const authController = require('./controller/authController');
//home page
// router.get("/",(req,res)=>{
//     res.send("Hello World From Just Another Sever")
// })

router.get("/",globalController.getArticles)
router.post("/info",globalController.info);


//Handle Request From Admin

router.post("/admin/register",authController.registration);
router.post("/admin/login",authController.login);
router.get("/admin",authController.verifyToken,adminController.getAdmin);
router.get("/admin/allUsers",authController.verifyToken,adminController.getAllUsers);
router.get("/admin/totalPosts",authController.verifyToken,adminController.getTotalPosts);
router.get("/admin/totalVisits",authController.verifyToken,adminController.getTotalVisits);



//Handle request From User Site
router.post("/login",authController.login)
router.post("/forgetPassword",authController.forgetPassword);
router.post("/register",authController.registration);
router.get("/user",authController.verifyToken,userController.getUser);
router.get("/refreshToken",authController.refreshToken,authController.verifyToken,userController.getUser)
router.post("/logout",authController.logout)

router.post("/user/post-article",authController.verifyToken,upload.single('image'),userController.postArticle);//request for create post

router.post("/post/comment/:articleId",authController.verifyToken,userController.postComment);//request for comment on post

router.delete("/post/:postId",authController.verifyToken,userController.deletePost)//request for delete post
//request for single article from user page after user login -
router.get("/user/article/:articleId",authController.verifyToken,userController.getSingleArticle);

router.put("/user/updateProfilePic",authController.verifyToken,profilePic.single('profileImage'),userController.updateProfilePic)//update user profile picture




//request for single article from home page with out login
router.get("/article/:articleId",globalController.getSingleArticle);


 module.exports = router;
