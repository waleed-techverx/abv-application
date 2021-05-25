const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Tokens = require('../models/tokens')

const authMiddleware =  async (req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await User.find({ _id: decoded._id})
        if(!user){
            throw new Error()
        }
        
        req.token = token
        req.user = {...user['0']._doc, access_token:token}
        
        next()
    }catch(e){
        res.status(401).send({error: 'Please Authenticate.'})
    }
}



module.exports = authMiddleware

// const authMiddleware =  async (req, res, next) =>{
//     try{
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

//         if(!user){
//             throw new Error()
//         }
        
//         req.token = token
//         req.user = user
//         next()
//     }catch(e){
//         res.status(401).send({error: 'Please Authenticate.'})
//     }
// }

// module.exports = authMiddleware