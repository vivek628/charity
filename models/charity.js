const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // Adjust the path as needed

const Charity = sequelize.define('Charity', {
    CharityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mission: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    goals: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    projects: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Password:{
           type:DataTypes.STRING,
           allowNull:false
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

module.exports = Charity;
