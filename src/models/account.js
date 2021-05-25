const mongoose = require('mongoose')
const User = require('./user')


const accountSchema = new mongoose.Schema({
    account_no: {
        type: String,
        required: true,
        trim: true
    },
    bank_name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        minlength: 4,
        trim: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    total_balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})


accountSchema.methods.isInvalidField = (receivedFields, validFieldsToUpdate) => {
    return receivedFields.some(
      (field) => validFieldsToUpdate.indexOf(field) === -1
    )
}

accountSchema.methods.getAccountByEmail = async (email) => {
    try {
        
        const user = await User.aggregate([
                {
                    $lookup:
                        {
                            from: "accounts", 
                            localField: "_id", 
                            foreignField: "userid", 
                            as: "account"
                        }
                },
                {
                    $match: {
                        email
                    }
                }
        ])
        delete user[0].password
        return user[0].account[0]
        
    } catch (error) {
        return null
    }
}


const Account = mongoose.model('Account', accountSchema)

module.exports = Account