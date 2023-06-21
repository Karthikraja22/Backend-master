const jwt = require('jsonwebtoken')
const User = require('../Model/User')


const authenticate =async(req,res,next)=>{
    if(req.headers.authorization){
        let decode = jwt.verify(req.headers.authorization,'1234')
        if(decode){
            req.userId = decode.userid
            const verifyUser = await User.findOne({_id:req.userId})
            if(verifyUser){
                next()
            }else{
                res.json({status:0,message:"Unauthorized"})
            }
        }else{
            res.json({status:0,message:"Unauthorized"})
        }
    }else{
        res.json({status:0,message:"Unauthorized"})
    }
}

module.exports = authenticate