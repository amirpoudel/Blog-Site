
const database = require('../database/database');

const getArticles = async (req,res)=>{
  
    const articles = await database.getArticles();
    

    console.log(articles);
   

  
       
    
    return res.status(200).json({articles});

}

const getSingleArticle  = async (req,res)=>{
    
    const id = req.params.articleId;
    console.log(id);
    const article = await database.getSingleArticle(id);
    console.log(article);

    res.status(200).json({article});

}

module.exports={
    getArticles:getArticles,
    getSingleArticle:getSingleArticle,
}