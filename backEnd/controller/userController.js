const database = require('../database/database');
const sendEmail = require('./sendEmail');













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




const postArticle = async (req,res)=>{
   
    const userId =req.id //we recieve from previous function after verify token;
    const data = JSON.parse(req.body.post);//the data came from data form so parse string ;
    //getting image from uploads folder
    let imagePath ;
    if(req.file){
        imagePath = req.file.path;
    }else{
        imagePath = null;
    }
    
    
    data.imagePath = imagePath
    console.log(data.imagePath);
    data.authorId = userId
    const databaseResponse = await database.createPost(data);
    console.log(databaseResponse);
    if(!databaseResponse){
        console.log("Could Not post data");
        return res.status(500).json({message:"Could not sumbit data please try again !!"});
    }
    console.log(data);
    
    let postId = 100;
    //await database.update_user_postId(userId,postId);
    console.log("Post Sumbit Sucessfully");
    //after post submit succesfull- send to link to subscriber
    // let subscribersEmail = await database.getAllNewsLetterEmail();
    // console.log(subscribersEmail);
    // sendEmail.sendNewsLetterMail(subscribersEmail,databaseResponse);

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

const deletePost = async(req,res)=>{
    console.log("This post should be deleted",req.params);

    const postId = req.params.postId;

    try {
        const response = await database.deletePost(postId);
        console.log(response);
        return res.status(200).json({message:"Post Delete Successfully"});
    } catch (error) {
        return res.status(400).json({message:"Unable To Delete Post"});
    }
}

const updateProfilePic = async(req,res)=>{


    //update user profile picture 

     //getting image from uploads/image/userProfilePic folder
     let imagePath ;
     let userId = req.id;
     if(req.file){
         imagePath = req.file.path;
         console.log('This is image path bro',imagePath);
         try {
            const response = await database.updateProfilePic(userId,imagePath);
            console.log(response);
            return res.status(200).json({message:"Image Update Success"})
         } catch (error) {
            return res.status(400).json({message:"Unable To Update Profile Pic"})
         }
         


     }else{
        return res.status(400).json({message:"Please Select Image"});
     }




     

}


module.exports = {

    getUser: getUser,

    postArticle: postArticle,
    getSingleArticle:getSingleArticle, 
    postComment:postComment,
    deletePost:deletePost,
    updateProfilePic:updateProfilePic,
};