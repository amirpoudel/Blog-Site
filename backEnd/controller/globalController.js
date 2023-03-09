
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

const searchArticles = async(req,res)=>{
    console.log("The data is comming for search",req.body);
    const searchWord = req.body.data;
    try {
        const articles = await database.searchArticles(searchWord);
       if(Object.keys(articles).length==0){
        console.log("No Matching Found");
        return res.status(404).json({message:"No Matching Found"}) ;
       }else{
        console.log("Matching Found",articles);
        return res.status(200).json({articles});
       }

    } catch (error) {
        return res.status(500).json({message:"Database Error"});
    }
   




}

module.exports={
    getArticles:getArticles,
    getSingleArticle:getSingleArticle,
    info:info,
    searchArticles:searchArticles,
}