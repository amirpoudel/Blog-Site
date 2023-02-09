
const express = require("express");
const cors = require("cors");
const app = express();
const router = require('./router');
const { application } = require("express");
const database = require('./database/database');
const cookieParse = require("cookie-parser");

const { mquery } = require("mongoose");

const port = 5000

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, "uploads/");
//     },
    
//   });
//   const upload = multer({ storage: storage });




app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParse());//for parsing the cookie
//make upload folder to static for render image in frontEnd;
app.use('/uploads',express.static('uploads'));
app.use(router);

database.connect().then((res)=>{
    console.log("Connection Successfull",res);
}).catch((err)=>{
    console.log("Connection Error",err);
});



app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
})