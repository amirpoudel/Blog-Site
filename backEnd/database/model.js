
const mongoose = require('mongoose');
const schema = require('./schema');


const User = mongoose.model('User',schema.userSchema);
const Post = mongoose.model('Post',schema.postSchema);
const Comment = mongoose.model('Comment',schema.commentSchema);
const ReplyComment  = mongoose.model('ReplyComment',schema.replyCommentSchema);



module.exports   = {
    User : User,
    Post : Post,
    Comment:Comment,
    ReplyComment:ReplyComment,
}