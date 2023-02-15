
const database = require('../database/database');

const EventEmitter = require("events");
const event  = new EventEmitter();

event.on("updateView",(async function(articleId){
    console.log("Calling event",articleId)
    await database.updateViews(articleId);
}))

const getArticles = async (req,res)=>{

    try {
        const articles = await database.getArticles();
    

    console.log(articles);
   

  
       
    
    return res.status(200).json({articles});
    } catch (error) {
        return res.status(500);
    }
  
    

}

const getSingleArticle  = async (req,res)=>{
    
    const id = req.params.articleId;
    console.log(id);
    try {
        const article = await database.getSingleArticle(id);
        console.log(article);
        //update views through event emmiter
        event.emit("updateView",id);
        
        return res.status(200).json({article});
    } catch (error) {
        return res.status(500);
    }
    

}

const info  = async(req,res)=>{
    console.log("The Comming Info Req,",req.body);
    await database.visitors(req.body);
}

module.exports={
    getArticles:getArticles,
    getSingleArticle:getSingleArticle,
    info:info,
}