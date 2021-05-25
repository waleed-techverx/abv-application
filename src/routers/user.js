const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const Tokens = require('../models/tokens')
const { sendWelcomMail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
const authMiddleware = require('../middleware/auth')

router.post('/signup', async (req, res) => {
    const {email} = req.body
    const user = new User(req.body)
    // sendWelcomMail(user.email, user.name)
    try {
        const validFieldsToUpdate = ['first_name', 'last_name', 'email', 'password']
        
        const receivedFields = Object.keys(req.body);
        
        const isInvalidFieldProvided = user.isInvalidField(
            receivedFields,
            validFieldsToUpdate
        )

        if (isInvalidFieldProvided) {
            return res.status(400).send({
              signup_error: 'Invalid field.'
            })
        }
        
        const duplicate = await User.find({email}).countDocuments()

        if (duplicate > 0) {
            return res.status(400).send({
              signup_error: 'User with this email address already exists.'
            });
        }

        await user.save() 
        
        res.status(201).send({user})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.validateUser(req.body.email, req.body.password)
        
        if (!user) {
            return res.status(400).send({
              signin_error: 'Email/password does not match.'
            })
        }
        const token = await user.generateAuthToken(user)

        const saveToken = new Tokens({access_token: token, userid:user._id})
        saveToken.save()
        
        if (!saveToken) {
            return res.status(400).send({
              signin_error: 'Error while signing in..Try again later.'
            });
        }
        
        // const userData = {...user._doc, token: saveToken.access_token}
        const userid = user._doc._id
        // email = user._doc.email
        res.status(200).send({userid, email, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/logout', authMiddleware, async (req, res) => {
    try{
        const { _id, access_token } = req.user

        const deleteToken = await Tokens.deleteMany({userid:_id, access_token})
        
        res.status(200).send(deleteToken)
    }catch(e){
        res.status(400).send({
            logout_error: 'Error while logging out..Try again later.'
        });
    }
})

router.post('/profile', authMiddleware, async (req, res) => {
    const { first_name, last_name } = req.body;
    console.log(req.body)
    const user = new User(req.body)
    
    try {
        const validFieldsToUpdate = ['first_name', 'last_name']
        const receivedFields = Object.keys(req.body);
        
        const isInvalidFieldProvided = user.isInvalidField(
            receivedFields,
            validFieldsToUpdate
        )
        
        if (isInvalidFieldProvided) {
            return res.status(400).send({
              signup_error: 'Invalid field.'
            })
        }
        
        const updateUser = await User.findOneAndUpdate({_id: req.user._id}, 
            {
                $set:{
                    first_name,
                    last_name
                }
            },)
        await updateUser.save()
        
        res.status(201).send(updateUser)
    } catch (e) {
        res.status(400).send({
            update_error: 'Error while updating profile..Try again later.'
        });
    }
})

router.get('/profile', authMiddleware, async (req, res) => {
    try{
        res.send(req.user)
    }catch(e){
        res.status(400).send({
            update_error: 'Error while getting profile data..Try again later.'
        });
    }
})



module.exports = router