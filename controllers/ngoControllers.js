const path=require('path')
const bcrypt=require('bcrypt')
const org=require('../models/charity')
const { or, where } = require('sequelize')
exports.regiterngo=(req,res,next)=>{
    try{
          res.sendFile(path.join(__dirname,'..','public/views/registerngo.html'))
    }
    catch(E)
    {
        console.log("err in ngo registration")
    }
}
exports.postregister=async(req,res,next)=>{
    try{
     const {orgname,email,password}=req.body
      console.log(orgname,email,password)
      
      const ispresent=await org.findOne({where:{email:email}})
      console.log(ispresent)
      if(ispresent)
      {
        return res.json({msg:"email already register"})
      }
    
      else{
        const hashpass= await bcrypt.hash(password,10)
        org.create({name:orgname,Email:email,Password:hashpass}) 
        res.json({msg:"ORG Resgistred successfully"})
      }
    
    }
    catch(e){
        console.log("err in",e)
    }
}
exports.orglogin=async(req,res,next)=>{
    try{
     const {email,password}=req.body
     const isexist=await ngo.findOne({where:{Email:email}})
     if(isexist)
     {
        const pass=await bcrypt.compare(password,isexist.Email)
        if(pass)

        {   console.log(isexist)
            const token= jwt.sign({ email: email, name:user.Name}, process.env.MY_SECRET_KEY)
            console.log("token",token)
            return res.json({msg:"LOGIN SUCCESFULL",token:token}) 

          
        }
        else
        return res.json({msg:"INCORRECT PASSOWRD"})
     }
    }
    catch(e)
    {
        console.log("err in login",e)
    }
}
exports.loginNgo=(req,res,next)=>{
    try{
       res.sendFile(path.join(__dirname,'..','public/views/ngologin.html'))
    }
    catch(e)
    {
        console.log("err in ngo getlogin",)
    }
}
exports.ngodisplay=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public/views/ngodisplay.html'))
}
exports.getngo=async(req,res,next)=>{
    const ngo=req.user
    const detail=await org.findOne({where:{Email:ngo.email}})

    console.log(ngo)
    res.json({ngo,detail})
}
exports.details=async(req,res,next)=>{
    console.log("ki")
    try{
        console.log(req.body)
        const ngoEmail=req.user.email
        const mission=req.body.mission
        const goals=req.body.goals
        const website=req.body.website
        const projects=req.body.projects
        await org.update({mission:mission,goals:goals,projects:projects,website:website},{
            where:{Email:ngoEmail}
        })
        res.json({msg:"data is addd"})
       
    }
   catch(e)
   {
    console.log("err in detail",e)
   }
}
exports.getorg=async(req,res,next)=>{
    try{
        const orgs=await org.findAll()
        res.json({data:orgs})
    }
    catch(E)
    {
        console.log("errr in getting data of orgs",E)
    }

}