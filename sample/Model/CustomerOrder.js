const mongoose = require('mongoose')
const CustomerOrderSchema = mongoose.Schema({
    name: { type: String, require: true },
    mobilenumber: { type: Number, require: true },
    email: { type: String },
    address: { type: String, require: true },
    district: { type: String },
    city: { type: String },
    pincode: { type: Number },
    state: { type: String },
    status:{type:String,default:"Pending"},
    crackerItems: [{
        name: { type: String },
        price: { type: Number },
        actualprice: { type: Number },
        quantity: { type: Number },
        image: { type: String, default: "" },
        pr_no: { type: String },
        cost: { type: Number },
        itemQuantity: { type: String }
    }]

},
{
    timestamps:true,
})

const Customer = mongoose.model('Customer', CustomerOrderSchema)

module.exports = Customer