const nodemailer = require("nodemailer")

const sendEmail =async(email,subject,text)=>{
    try {
        const  transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            service:"gmail",
            port:587,
            secure:true,
            auth:{
                user:"karthikraja2217@gmail.com",
                pass:"yaspycuhapfnvwcj"
            }
        })

        await transporter.sendMail({
            from:"karthikraja2217@gmail.com",
            to:email,
            subject:subject,
            text:text
        })
        console.log("email sent successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports=sendEmail