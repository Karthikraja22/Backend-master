const Customer = require("../Model/CustomerOrder");
const User = require("../Model/User");
const sendEmail = require("../Sendmail");
const createCustomer = async (req, res) => {
    console.log(req.body);
    const createNewCustomer = await Customer.create({ ...req.body })
    const admin = await User.findOne({ role: 'Admin' })
    console.log(admin)

    let content = `Hi ${createNewCustomer.name},Your order has been placed successfully!`
    sendEmail(createNewCustomer.email, "ORDER PLACED!", content)

    if (!admin) {
        res.json({ status: 0, message: "Admin not found" })
    } else {
        let content = ` ${createNewCustomer.name}from ${createNewCustomer.district} has placed an Order of ${createNewCustomer.crackerItems} `
        sendEmail(admin.email, "ORDER PLACED!", content)
    }

    if (!createNewCustomer) {
        res.json({ status: 0, message: "Customer Id Not created" })
    }
    res.json({ status: 1, message: "Created" })

}

const getCustomer = async (req, res) => {
    const getAlldetails = await Customer.find()
    if (!getAlldetails) {
        res.json({ status: 0, message: "Not Found" })
    }
    res.json({ status: 1, response: getAlldetails })
}

const getdetailbyId = async (req, res) => {
    const getOne = await Customer.findById(req.params.id)
    if (!getOne) {
        res.json({ status: 0, message: "Not Found" })
    }
    res.json({ status: 1, response: getOne })
}
const deleteCustomer = async (req, res) => {
    const removeCustomer = await Customer.findByIdAndDelete(req.params.id)
    if (!removeCustomer) {
        res.json({ status: 0, message: "Not Found" })
    }
    res.json({ status: 1, message: "Deleted" })
}

const updateCustomer = async (req, res) => {
    const updatedetail = await Customer.findByIdAndUpdate(req.params.id, req.body)
    if (!updatedetail) {
        res.json({ status: 0, message: "Not Found" })
    }
    res.json({ status: 1, message: "Updated" })
}


const aggregateOrder =async(req,res)=>{
    const {search,status,skip,limit,pincode}=req.body
    let query=[]
    console.log(pincode)

    if(search!==""){
        query.push(
           {
            $match:{
                $or:[
                    {
                        name:{
                            $regex:search+'.*',
                        },
                    },{
                        mobilenumber:{
                            $regex:search+'.*',
                        },
                    },
                    {
                        email:{
                            $regex:search+'.*',
                        },
                    },{
                        state:{
                            $regex:search+'.*',
                        },
                    },
                    {
                        city:{
                            $regex:search+'.*',
                        },
                    },{
                        district:{
                            $regex:search+'.*',
                        },
                    }
                ]
            }
           }
            )
    }

    if(pincode!==""){
        query.push({
            $match:{
                pincode:pincode
            }
        })
    }
    if(status!==""){
        query.push({
            $match:{
                status:status
            }
        })
    }

    if(status!==""){
        query.push({
            $match:{
                status:status
            }
        })
    }

    const withoutLimit =Object.assign([],query)
    withoutLimit.push({$count:'count'})

    query.push(
        {$skip:parseInt(skip)},
        {$limit:parseInt(limit)},
        {
            $project:{
                _id:1,
                name:1,
                city:1,
                state:1,
                district:1,
                pincode:1,
                mobilenumber:1,
                email:1,
                address:1,
                status:1,
                crackerItems:1
            }
        }
    )

    const finalQuery =[
        {
            $facet:{
                overall:withoutLimit,
                documentData:query
            }
        }
    ]

    const getAggregateOrder = await Customer.aggregate(finalQuery)
    console.log(getAggregateOrder)
    const data = getAggregateOrder[0].documentData
    let fullcount=0
    if(getAggregateOrder[0]?.overall[0]?.count){
         fullcount = getAggregateOrder[0].overall[0].count
    }
    

    if(data && data.length>0){
        res.json({
            status:1,
            response:{
                result:data,
                fullcount:fullcount,
                length:data.length
            }
        })
    }else{
        res.json({
            status:0,
            response:{
                result:[],
                fullcount:fullcount,
                length:data.length
            }
        })
    }
   
}


module.exports = { createCustomer, getCustomer, getdetailbyId, deleteCustomer, updateCustomer,aggregateOrder }

