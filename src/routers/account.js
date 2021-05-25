const express = require('express')
const User = require('../models/user')
const Tokens = require('../models/tokens')
const Account = require('../models/account')
const { sendWelcomMail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
const authMiddleware = require('../middleware/auth') 
const isWhat = require('../middleware/adminAuth') 

const USERS_TYPE = Object.freeze({
    ADMIN: "admin",
    USER: "user"
})

router.post('/account', authMiddleware, async (req, res) => {
    
    const account = new Account(req.body)
    try {
        
        const duplicate = await Account.aggregate([
            { 
                $match: { 
                    $or: [{ 
                        account_no: req.body.account_no
                    }, { 
                        userid: req.user._id 
                    }] 
                }
            }
        ])

        if (duplicate.length > 0) {
            return res.status(400).send({
              account_creation_error: 'Account already exists.'
            });
        }
        account.userid = req.user._id
        await account.save() 
        
        res.status(201).send({account})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/account', authMiddleware, async (req, res) => {
    const { code } = req.body;
    const account = new Account(req.body)
    
    try {
        
        const updateAccount = await Account.findOneAndUpdate({userid: req.user._id}, 
            {
                $set:{
                    code
                }
            },)
        await updateAccount.save()
        
        res.status(201).send(updateAccount)
    } catch (e) {
        res.status(400).send({
            account_updation_error: 'Error while updating account..Try again later.'
        });
    }
})

router.get('/account', authMiddleware, async (req, res) => {
    const account = new Account()
    try {
      const result = await account.getAccountByEmail(req.user.email);
      
      if (result) {
        res.send({ account: result });
      } else {
        res.status(400).send({
          get_error: 'Account details does not exist.'
        });
      }
    } catch (error) {
      res.status(400).send({
        get_error: 'Error while getting account details..Try again later.'
      });
    }
});

module.exports = router