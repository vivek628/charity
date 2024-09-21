const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // Ensure this path is correct

const Payment = sequelize.define('Payment', { // Use singular and capitalize the model name
    paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Optional: Ensure each payment ID is unique
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ngoId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT, // Change to FLOAT or INTEGER
        allowNull: false
    },
    donor:{
        type:DataTypes.STRING,
        allowNull:false
    },
    orgName:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = Payment;
