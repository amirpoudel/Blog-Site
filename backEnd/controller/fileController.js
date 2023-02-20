const multer = require('multer');

 const upload = multer({dest:"uploads/"});
 const profilePic = multer({dest:"uploads/image/userProfilePic"})


 module.exports = {upload,profilePic}