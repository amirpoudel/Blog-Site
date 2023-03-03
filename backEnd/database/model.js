
const mongoose = require('mongoose');
const schema = require('./schema');

const Admin = mongoose.model('Admin',schema.adminSchema)

const User = mongoose.model('User',schema.userSchema);
const Post = mongoose.model('Post',schema.postSchema);
const Comment = mongoose.model('Comment',schema.commentSchema);
const ReplyComment  = mongoose.model('ReplyComment',schema.replyCommentSchema);
const Visitor  = mongoose.model('Visitor',schema.visitorsSchema)
const Token = mongoose.model('Token',schema.tokenSchema);


module.exports   = {
    Admin:Admin,
    User : User,
    Post : Post,
    Comment:Comment,
    ReplyComment:ReplyComment,
    Visitor:Visitor,
    Token  : Token,
}