const bcrypt=require('bcrypt')
const User=require('../models/user')
const Ngo=require('../models/charity')
const payment=require('../models/paymen')
const { where } = require('sequelize')
const path=require('path')
const jwt=require('jsonwebtoken')
const Razorpay = require('razorpay');
const salt=10
exports.getsignup=async(req,res,next)=>{
    try{
         res.sendFile(path.join(__dirname,'..','public/views/signup.html'))
    }
    catch(e)
    {
        console.log("err in getsignup")
    }
}
exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);

        
        const hashpass = await bcrypt.hash(password, salt);
        
       
        const user = await User.findOne({ where: { UserEmail: email } });
        console.log(user);

        if (user) {
            return res.json({ message: "USER ALREADY EXISTS" });
        }

        
        await User.create({
            UserName: username,
            UserEmail: email,
            UserPassword: hashpass
        });

        res.json({ message: "USER CREATED" });
    } catch (e) {
        console.log("Error in signup", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getlogin=async(req,res,next)=>{
    try{
       res.sendFile(path.join(__dirname,'..','public/views/login.html'))
    }
    catch(E)
    {
        console.log("err in login",e)
    }
}
exports.postlogin=async(req,res,next)=>{
    
    try{
      const {email,password,type}=req.body
      console.log(email,password,type)
      if(type=='user')
      {
        const user=await  User.findOne({where:{UserEmail:email}})
        if(!user)
        {
          res.json({msg:"USER DOES NOT EXIST"})
        }
        const isuser= await bcrypt.compare(password,user.UserPassword)
        if(isuser)
        {
          console.log(user)
          const token= jwt.sign({ email: email, name:user.UserName}, process.env.MY_SECRET_KEY)
          console.log("token",token)
          return res.json({msg:"LOGIN SUCCESFULL",token:token}) 
        }
        else{
          res.json({msg:"PASSWORD IS INCORRECT"})
        }
      }
      else if(type=='ngo')
      {
        const charity=await  Ngo.findOne({where:{Email:email}})
        if(!charity)
        {
          res.json({msg:"Charity DOES NOT Registered"})
        }
        const ischarity= await bcrypt.compare(password,charity.Password)
        if(ischarity)
        {
          console.log("name of charity is ",charity.name)
          const token= jwt.sign({ email: email, name:charity.name}, process.env.MY_SECRET_KEY)
          console.log("token",token)
          return res.json({msg:"LOGIN SUCCESFULL",token:token}) 
        }
        else{
          res.json({msg:"PASSWORD IS INCORRECT"})
        }
      }
      }
   
    catch(E){
         console.log("something went wrong in login",E)
    }
}
exports.userdisplay=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public/views/userdisplay.html'))
}
exports.getuser=async(req,res,next)=>{
    console.log(req.user)
    const user=req.user
    const donor = await User.findOne({
      where: { UserEmail: req.user.email },
      attributes: ['UserId'] 
  })
   
    const donated =await payment.findAll({where:{donor:req.user.name},attributes: ['amount']}
      
    )
    let amount=0
    donated.forEach(element => {
     amount= element.dataValues.amount+amount
    });
  
    console.log(amount)
    
    res.json({User:user,donor:amount})
}
exports.donate=async(req,res,next)=>{
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
  try{
    const options = {
      amount: req.body.amount, 
      currency: 'INR',

  };
  const order = await razorpay.orders.create(options);
  console.log("order",order)
  console.log("Order created:", order.id);
  res.json({order:order,razorpay_key:razorpay.key_id}); 

  }
  catch(E)
  {
 console.log("err in pay",E)
  }
}
exports.savepayment=async(req,res,next)=>{
  try{
      console.log(req.body)
      console.log(req.user)
      const org=req.body.org
      const paymentId=req.body.paymentId
      const ngo = await Ngo.findOne({
        where: { name: org },
        attributes: ['CharityId'] 
    });
    const donor = await User.findOne({
      where: { UserEmail: req.user.email },
      attributes: ['UserId']
  });
    console.log(ngo.CharityId)
    await payment.create({paymentId:paymentId,userId:donor.UserId,ngoId:ngo.CharityId,amount:req.body.amount,donor:req.user.name,orgName:org})
    res.json({msg:"ok"})

  }
  catch(E)
  {
    console.log("err in adding pay",E)
  }
}
exports.alldonation=async(req,res,next)=>{
try{
const donor=req.user.name

const alldonation=await payment.findAll({where:{donor:donor}})
console.log("alldonation",alldonation)
res.json({alldonation:alldonation})

}
catch(E)
{
  console.log("err in fetching data",E)
}
}