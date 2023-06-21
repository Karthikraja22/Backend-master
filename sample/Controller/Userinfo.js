const {genSalt} = require("bcryptjs")
const User = require("../Model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../Sendmail")


// login credentials
const login = async (req,res) => {
    const {email,password} = req.body
    console.log(req.body)
    
    if(email!="")    {
        const checkUser = await User.findOne({email:email})
        console.log(checkUser)
        if (checkUser){
            const checkPassword = await bcrypt.compare(password,checkUser.password)
             if (checkPassword){
                let token = jwt.sign({username:checkUser.username,userid:checkUser._id},"1234",{expiresIn:"2 hr"})
                  
                res.json({status:1,message:"logged in successfully!",token:token})
               
             }else{
                 res.json({status:0,message:"invalid password!"})
                
             }
        }else {
            res.json({status:0, message:"user not found!"})
            
        }
    }
}



// create User
const createUser = async(req,res) => {
    console.log(req.body);
    let {password} = req.body
    let hashedpassword = await bcrypt.hash(password,10)
    const createNewUser = await User.create({...req.body,password:hashedpassword})
    if(!createNewUser){
        res.json({status:0, message:"User is not created"})
        return
    } 
    res.json({status:1,message:"Created successfully!"})
}

// find all data
const getUsers = async(req,res) => {

    const getallUsers = await User.find()

if (!getallUsers){
res.json({status:0,Message:"not found!"})
}
res.json({status:1,response:getallUsers})
}

// find by id
const getUserbyId = async(req,res) => {

    const getUser = await User.findById(req.params.id)

if (!getUser){
res.json({status:0,Message:"not found!"})
}
res.json({status:1,response:getUser})
}

// delete one data
const deletebyId = async(req,res) => {

    const deleteUser = await User.findByIdAndDelete(req.params.id)

if (!deleteUser){
res.json({status:0,Message:"not found!"})
}
res.json({status:1,message:"deleted"})
}


//update one data
const updateUserdetails = async(req,res) => {

    const update = await User.findByIdAndUpdate(req.params.id,req.body)

if (!update){
res.json({status:0,Message:"not updated!"})
}
res.json({status:1,message:"updated succesfully!"})
}

const forgotPassword = async(req,res)=>{
    const {email}= req.body
    const checkUser = await User.findOne({email:email})
    console.log(checkUser)

    if(checkUser){
        let otp = Math.floor(1000+Math.random()*9000)
        let otpTime = Date.now()+360000
        
        let data ={
            otp:otp,
            otpTimeStamp:otpTime
        }
        const updateOtp = await User.findByIdAndUpdate(checkUser._id,data)
        if(updateOtp){
            let content = `Hi ${checkUser.first_name} ${checkUser.last_name},Your OTP - ${otp}, it is valid for 6 mins.`
            sendEmail(checkUser.email,"OTP Password Reset",content)
            res.json({status:1,message:"Email Sent Successfully"})
        }else{
            res.json({status:0,message:"Not Updated"})
        }
    }else{
        res.json({status:0,message:"Üser Not found"})
    }

}

const verifyOtp = async(req,res)=>{
    const {email,otp}=req.body
    console.log(typeof(otp))
    const checkUser =await User.findOne({email:email})
    if(!checkUser){
        res.json({status:0,message:"user not found"})
        return
    }

    if(parseInt(otp)===checkUser.otp){
        console.log(Date.now())
        console.log(checkUser.otpTimeStamp)
        if(checkUser.otpTimeStamp > Date.now()){
            const updateUser = await User.updateOne({_id:checkUser._id},{otpVerify:true})
            res.json({status:1,message:"OTP verified Successfully"})
        }else{
            res.json({status:0,message:"OTP expired"})
        }
    }else{
        res.json({status:0,message:"OTP Invalid"})
    }
    //yaspycuhapfnvwcj

}


const resetPassword =async(req,res)=>{
    const {email,newPassword,confirmPassword}=req.body
    const checkUser =await User.findOne({email:email})
    if(!checkUser){
        res.json({status:0,message:"user not found"})
        return
    }
    if(checkUser.otpVerify){
        if(newPassword===confirmPassword){
            let hashedpassword = await bcrypt.hash(newPassword,10)
            const updateUser = await User.updateOne({_id:checkUser._id},{otpVerify:false,password:hashedpassword})
            res.json({status:1,message:"Password reset Success"})

        }else{
            res.json({status:0,message:"Password not match"})
        }
    }else{
        res.json({status:0,message:"Otp verification needed"})
    }
}


module.exports = {createUser,getUsers,getUserbyId,deletebyId,updateUserdetails,login,forgotPassword,verifyOtp,resetPassword}