const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    transaction_date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    withdraw_amount: {
        type: Number
    },
    deposit_amount: {
        type: Number
    },
    balance: {
        type: Number,
        default: 0
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account'
    }
}, {
    timestamps: true
})


const Transactions = mongoose.model('Transactions', transactionSchema)

module.exports = Transactions