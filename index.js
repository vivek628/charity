const express=require('express')
const app= express()
require('dotenv').config()
const sequelize=require('./utils/db')
const port=process.env.PORT || 3000
const User=require('./models/user')
const Charity=require('./models/charity')
const payment=require('./models/paymen')
const userRoute=require('./routes/userRoute')
const ngoRoutes=require('./routes/ngoRoutes')
const bodyParser=require('body-parser')
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

app.use(express.static('public'))
app.use(userRoute)
app.use(ngoRoutes)
sequelize.sync().then(()=>{
    app.listen(port,()=>{
        console.log("server is running",port)
    })
}).catch((e)=>{
    console.log("err in sequelize",e)
})

