const mongoose = require('mongoose')

const crackerSchema = mongoose.Schema({
    name :{type:String,unique:true,require:true},
    price :{type:Number,require:true},
    amount :{type:Number,require:true},
    quantity :{type:Number,default:1},
    image :{type:String,default:""},
    category:{type:String,default:""},
    pr_no :{type:String},
    createdBy:{type:mongoose.Schema.Types.ObjectId}
},{
    timestamps:true,
})
const Crackers = mongoose.model('Crackers',crackerSchema)
module.exports = Crackers