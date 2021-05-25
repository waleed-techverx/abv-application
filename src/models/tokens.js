const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, {
    timestamps: true
})

const Tokens = mongoose.model('Tokens', tokenSchema)

module.exports = Tokens