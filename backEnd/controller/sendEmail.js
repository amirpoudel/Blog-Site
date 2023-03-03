
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD
    }
})

async function sendTokenMail(email,token){

    let mailOption = {
        from:`${process.env.EMAIL}`,
        to:`${email}`,
        subject:'Your Token For Password Reset',
        text:`Your Token is ${token} . Don't Forget Password Next Time 😉 `

    }


    transporter.sendMail(mailOption,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email Sent: "+info.response);
        }
    })

}


module.exports={
    sendTokenMail:sendTokenMail,

}




