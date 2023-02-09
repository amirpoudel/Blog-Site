
const express = require('express');
const { verifyToken } = require('./controller/userController');
const userController = require('./controller/userController');
const globalController = require('./controller/globalController')
const router = express.Router();
const {upload} = require('./controller/fileController');// multer storage....
//home page
// router.get("/",(req,res)=>{
//     res.send("Hello World From Just Another Sever")
// })



router.get("/",globalController.getArticles)

//Handle request From User Site
router.post("/login",userController.login)
router.post("/register",userController.registration);
router.get("/user",userController.verifyToken,userController.getUser);
router.get("/refreshToken",userController.refreshToken,userController.verifyToken,userController.getUser)
router.post("/logout",userController.logout)
//request for create post
router.post("/user/post-article",userController.verifyToken,upload.single('image'),userController.postArticle);
//request for comment on post
router.post("/post/comment/:articleId",userController.verifyToken,userController.postComment);


//request for single article from home page with out login
router.get("/article/:articleId",globalController.getSingleArticle);
//request for single article from user page after user login -
router.get("/user/article/:articleId",userController.verifyToken,userController.getSingleArticle);

 module.exports = router;
