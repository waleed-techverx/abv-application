const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    }
}, {
    timestamps: true
})



userSchema.methods.generateAuthToken = async function (user) {
    user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    // user.tokens = user.tokens.concat({token})
    // await user.save()
    return token
}

userSchema.methods.isInvalidField = (receivedFields, validFieldsToUpdate) => {
    return receivedFields.some(
      (field) => validFieldsToUpdate.indexOf(field) === -1
    )
}

userSchema.statics.validateUser = async (email, password) => {
    const user = await User.findOne({ email })
    if (user){
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch == true) {
            delete user._doc.password
            return user;
        }else{
            return null
        }
    }else {
        return null
    }
    
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User