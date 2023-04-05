const multer = require('multer');
const { storeTokenValue } = require('../database/database');
const fs  = require('fs');
const fsPromises = fs.promises;
 const upload = multer({dest:"uploads/"});
 
 const userProfileImageStorage = multer.diskStorage({
   
    destination: async function (req,file,cb){
        //if no folder then create;
        const folderPath = `uploads/users/${req.id}/profileImage`
      
        try {
            if(!fs.existsSync(folderPath)){
           
                await fsPromises.mkdir(folderPath,{recursive:true});
              
        }
        } catch (error) {
            console.log(error)
        }
        
        
        return cb(null,`uploads/users/${req.id}/profileImage`)
    },
    filename:function(req,file,cb){
        return cb(null,`profileImage`);
    }

 })
//configuration this folder later
//  const articleImageStorage = multer.diskStorage({
    
//     destination: async function(req,file,cb){

//         const folderPath = `uploads/users/${req.id}/articles/${req.articleId}`

//         try {
//             if(!fs.existsSync(folderPath)){
           
//                 await fsPromises.mkdir(folderPath,{recursive:true});
              
//         }
//         } catch (error) {
//             console.log(error)
//         }
        
        
//         return cb(null,folderPath)
//     },
//     filename:function(req,file,cb){
//         return cb(null,`profileImage`);
//     }
    

//  })


const userProfileImage = multer({storage:userProfileImageStorage});



 module.exports = {userProfileImage,upload}


 