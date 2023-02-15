const {Schema, isObjectIdOrHexString}  = require('mongoose');

//------------------------------------Schema For Admin----------------------------

const adminSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    }

},{timestamps:true})


//-----------------------------------Schema For User--------------------------------

const userSchema = new Schema({
    name : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        require:true,
        unique:true,
    },
    password : {
        type:String,
        require:true,
        
    },
    posts:[{type:Schema.Types.ObjectId,ref:'Post'}],
   

},{timestamps:true})

//Post Schema 

const postSchema = new Schema({

    authorId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        require:true,
    },
    body:{
        type:String,
        require:true,
    },
    
    imagePath:{
        type:String,
    },

    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment',
    }],
    views:{
        type:Number,
        default:0,
    },

    date:{
        type:Date,
        default:Date.now,
    },

    



},{timestamps:true})

//comment Schema associated to post

const commentSchema = new Schema({

        postId:{
            type:Schema.Types.ObjectId,
            ref:'Post',

        },

        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
        },

        comment:{
            type:String,
            maxLength:200,
            
        },
        replyComment:[{
            type:Schema.Types.ObjectId,
            ref:"ReplyComment",
            
        }]
      
},{timestamps:true}

)
//Reply Comment Schema - link to comment schema

const replyCommentSchema = new Schema({

    commentId:{
        type:Schema.Types.ObjectId,
        ref:'Comment',

    },

    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    comment:{
        type:String,
        maxLength:200,
        
    },
    

},{timestamps:true})


//visitors information

const visitorsSchema= new Schema({
    ip:String,
    city:String,
    region:String,
    country_name:String,
    latitude:String,
    longitude:String,
    org:String,
})


module.exports = {
    //export admin'
    adminSchema:adminSchema,
    //export user 
    userSchema : userSchema,
    postSchema : postSchema,
    commentSchema:commentSchema,
    replyCommentSchema:replyCommentSchema,
    visitorsSchema:visitorsSchema,

}