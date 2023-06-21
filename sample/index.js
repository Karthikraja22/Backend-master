const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const path =require('path')

const cracker = require('./Routes/Crackers')
const User = require('./Routes/Users')
const customer = require('./Routes/CustomerOrder')
// port creation
const PORT = 7000

// saving in app
const app = express()

// json conversion
app.use(express.json())

// cors
app.use(cors())

// routes
app.use('/',cracker)
app.use('/',User)
app.use('/',customer)
app.use('/uploads',express.static(path.join(__dirname,"/uploads")))
const URI = 'mongodb+srv://karthikraja:karthikraja@cluster0.v6snujf.mongodb.net/'

mongoose.connect(URI).then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running in ${PORT}`);
    })
}).catch((error)=>{
    console.log(error);
    })