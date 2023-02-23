const mongoose = require("mongoose");
const { user } = require("./model");
const model = require('./model');
const url = 'mongodb://localhost:27017/movie-streaming'

async function connect(){
    await mongoose.connect(url);
}

//---------------------------------------------------ADMIN CONTROLLER------------------------------------------------


async function createAdmin(name,email,password){

    try {
        const admin = new model.Admin({
            name:name,
            email:email,
            password:password
        })
        await admin.save();
        
    } catch (error) {
        return new Error(error)
    }

}

async function findAdminByEmail(email){
    try {
        
        const adminData = await model.Admin.findOne({email:email});
        return adminData;

    } catch (error) {
        return new Error(error);
    }
}

async function findAdminById(id){
    try {
        const adminData = await model.Admin.findById(id,"-password")
        return adminData;
    } catch (error) {
        return new Error(error);
    }
}

async function findAllUsers(){
    try {
        let allUsers =  await model.User.find({},["-password","-posts"]);
        return allUsers;
    } catch (error) {
        
    }
}



//------------------------------------------------------USER CONTROLLER-----------------------------------------------

//-------------------Insert Data -------------------

async function createUser(name,email,password){
        try {
            const user = new model.User({
                name:name,
                email:email,
                password:password,
                posts:[],
            })
            await user.save();
            console.log("data save succesfully");
        } catch (error) {
            return new Error(error);
        }
}

async function findUserByEmail(email){
    try {
        
        const userData = await model.User.findOne({email:email});
        return userData;

    } catch (error) {
        
    }
}

async function findUserById(id){
    try{
        const userData = await model.User.findById(id,"-password").populate('posts'); //return everything except password;
        return userData;
    }catch(error){

    }
}

//create post

async function createPost(post){
    try {
        const res = await model.Post({
            authorId:post.authorId,
            author:post.author,
            title:post.title,
            body:post.body,
            // image:{
            //     data:post.imageData,
            //     contentType:"image/jpeg",
            // }
            //temp solution for upload image
        
            imagePath:post.imagePath,

        })

        await res.save();

        await model.User.findOneAndUpdate({_id:post.authorId},{$push:{posts:res._id}});//find user and update post id 
        console.log("Post Save Successfully!!!");

    } catch (err) {
        return new Error(err);
    }
}

// create comment 

async function createComment(userId,articleId,comment){


        try {

            const res  = await model.Comment({
             postId:articleId,
             userId:userId,
             comment:comment,
             replyComment:[],
            })
             await res.save();
            //
            await model.Post.findOneAndUpdate({_id:articleId},{$push:{comments:res._id}})//find post and update comment section ;
            //after creating comment also update in post comment section
            return res;
            

        } catch (error) {
            return new Error(error);
        }

}

//delete post

async function deletePost(postId){
    try {
        const res = await model.Post.findByIdAndDelete({_id:postId});
        console.log(res);
        return res;
    } catch (error) {
        return new Error(error);
    }
}

async function updateProfilePic(userId,imagePath){
    try {
        const res = await model.User.findByIdAndUpdate(userId,{ profileImagePath:imagePath});
        console.log(res);
        return res;
    } catch (error) {
        return new Error(error);
    }
}



//----------------------Global Controller------------------------------


//get all articles 
async function getArticles(){
    try {
        const articles = await model.Post.find({}).populate('comments');
        return articles;
    } catch (error) {
        return new Error(error);
    }
}

//get single article by id

async function getSingleArticle(id){
    try {
        //find post and update the views 
        const article = await model.Post.findByIdAndUpdate(id).populate('comments');
        
        return article;
    } catch (error) {
        return new Error(error);
    }
}

// update vies
async function updateViews(articleId){
    try {
       const res =  await model.Post.updateOne({_id:articleId},{$inc:{views:1}});//update view count
        console.log(res);
    } catch (error) {
        
    }
}

async function totalUsers(){
    try {
        
    } catch (error) {
        
    }
}
async function totalPosts(){
    try {
        const res = await model.Post.estimatedDocumentCount();
        return res;
    } catch (error) {
        return new Error(error);
    }
}
async function totalVisits(){

    try {
        const res = await model.Visitor.estimatedDocumentCount();
        return res;
    } catch (error) {
        return new Error(error);
    }

}

async function visitors(info){
    try {
        const res = await model.Visitor(
            {
                ip:info.ip,
                city:info.city,
                region:info.region,
                country_name:info.country_name,
                latitude:info.latitude,
                longitude:info.longitude,
                org:info.org,
            }
        );
        console.log(res);
        await res.save();
    } catch (error) {
        return new Error(error);
    }
}


async function changeVisitors(){
    try {
        // model.Visitor.watch().on('change',(data)=>{
        //     console.log(data);
        // })
    } catch (error) {
        
    }
}


module.exports = {
    connect : connect,


    //user related function
    createUser:createUser,
    findUserByEmail:findUserByEmail,
    findUserById: findUserById,
    createPost:createPost,
    createComment:createComment,
    getArticles:getArticles,
    getSingleArticle:getSingleArticle,
    updateViews:updateViews,
    deletePost:deletePost,
    updateProfilePic:updateProfilePic,

    //admin related function
    createAdmin:createAdmin,
    findAdminByEmail:findAdminByEmail,
    findAdminById:findAdminById, //not returning password
    findAllUsers:findAllUsers,


    //counting related function,
    totalVisits:totalVisits,
    totalPosts:totalPosts,


    //global controller
    visitors:visitors,


    //watch stream
    changeVisitors:changeVisitors,

}
