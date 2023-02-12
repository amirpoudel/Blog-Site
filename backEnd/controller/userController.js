const database = require('../database/database');













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

    getUser: getUser,

    postArticle: postArticle,
    getSingleArticle:getSingleArticle, 
    postComment:postComment,
};