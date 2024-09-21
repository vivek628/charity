const {DataTypes}=require('sequelize')
const sequelize=require('../utils/db')
const User=sequelize.define('User',{
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    UserName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    UserEmail:{
        type:DataTypes.STRING,
        allowNull:false
    },
    UserPassword:{
        type:DataTypes.STRING,
        allowNull:false 
    }
})
module.exports=User