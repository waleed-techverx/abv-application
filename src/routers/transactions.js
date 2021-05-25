const express = require('express')
const ejs = require('ejs')
const moment = require('moment')
const User = require('../models/user')
const Tokens = require('../models/tokens')
const Account = require('../models/account')
const Transactions = require('../models/transactions')
const { sendWelcomMail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
const authMiddleware = require('../middleware/auth') 
const mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');


router.post('/deposit/:id', async (req, res) => {
    const { transaction_date, deposit_amount } = req.body;
    const transaction = new Transactions(req.body)
    
    try {
        
        const account_id = req.params.id;
        const account = await Account.find({_id: account_id})
        const total_balance = +account[0].total_balance
        const total = total_balance + deposit_amount

        transaction.account_id = account_id
        transaction.balance = total
        await transaction.save()

        const updateAccount = await Account.findOneAndUpdate({_id: account_id}, 
            {
                $set:{
                    total_balance: total_balance + deposit_amount
                }
            },)

        await updateAccount.save()
        const updatedAccount = await Account.find({_id: account_id})
        res.status(200).send(updatedAccount)
        
    } catch (e) {
        res.status(400).send({
            add_error: 'Error while depositing amount..Try again later.'
        })
    }
})

router.post('/withdraw/:id', async (req, res) => {
    const { transaction_date, withdraw_amount } = req.body;
    const transaction = new Transactions(req.body)
    
    try {
        
        const account_id = req.params.id;
        const account = await Account.find({_id: account_id})
        const total_balance = +account[0].total_balance
        const total = total_balance - withdraw_amount

        if (withdraw_amount <= total_balance) {
            transaction.account_id = account_id
            transaction.balance = total
            await transaction.save()

            const updateAccount = await Account.findOneAndUpdate({_id: account_id}, 
                {
                    $set:{
                        total_balance: total_balance - withdraw_amount
                    }
                },)
                
            await updateAccount.save()
            const updatedAccount = await Account.find({_id: account_id})
            res.status(200).send(updatedAccount)

        }else{
            return res.status(400).send({
                withdraw_error: "You don't have enough balance in your account"
            });
        }

    } catch (e) {
        res.status(400).send({
            withdraw_error: 'Error while withdrawing amount..Try again later.'
        })
    }
})

router.post('/transfer/:id', async (req, res) => {
    const { transaction_date, deposit_amount, account_no } = req.body;
    const transaction = new Transactions()
    const ottransaction = new Transactions()
    
    try {
        
        const account_id = req.params.id;
        const account = await Account.find({_id: account_id})
        const otaccount = await Account.find({account_no: account_no})

        const total_balanceacc = +account[0].total_balance
        const totalacc = total_balanceacc - deposit_amount

        if (deposit_amount <= total_balanceacc) {
            transaction.account_id = account_id
            transaction.transaction_date = transaction_date
            transaction.balance = totalacc
            transaction.withdraw_amount = deposit_amount
            await transaction.save()

            const updateAccount = await Account.findOneAndUpdate({_id: account_id}, 
                {
                    $set:{
                        total_balance: total_balanceacc - deposit_amount
                    }
                },)
                
            await updateAccount.save()

        }else{
            return res.status(400).send({
                withdraw_error: "You don't have enough balance in your account"
            });
        }

        const total_balanceotacc = otaccount[0].total_balance
        const totalotacc = parseInt(total_balanceotacc) + parseInt(deposit_amount)
        ottransaction.account_id = otaccount[0]._id
        ottransaction.transaction_date = transaction_date
        ottransaction.balance = totalotacc
        ottransaction.deposit_amount = deposit_amount
        
        await ottransaction.save()
        
        const otupdateAccount = await Account.findOneAndUpdate({account_no: account_no}, 
            {
                $set:{
                    total_balance: parseInt(total_balanceotacc) + parseInt(deposit_amount)
                }
            },)
        
        await otupdateAccount.save()
        res.status(200).send(otupdateAccount)
        
    } catch (e) {
        res.status(400).send({
            add_error: 'Error while depositing amount..Try again later.'
        })
    }
})



router.get('/transactions/:id', async (req, res) => {
    const { start_date, end_date } = req.query;
    const transaction = new Transactions()
    try {
        
        const result = await getTransactions(req.params.id, start_date, end_date);
        res.status(200).send(result)
    } catch (e) {
        res.status(400).send({
            transactions_error:
              'Error while getting transactions list..Try again later.'
        })
    }
})

router.get('/download/:id', async (req, res) => {
    const account = new Account()
    try {
        const { start_date, end_date } = req.query;
        const account_id = req.params.id;
        const result = await getTransactions(req.params.id, start_date, end_date);
        const basePath = path.join(__dirname, '..', 'views');
        const templatePath = path.join(basePath, 'transactions.ejs');
        const templateString = ejs.fileLoader(templatePath, 'utf-8');
        const template = ejs.compile(templateString, { filename: templatePath });
        const accountData = await getAccountByAccountId(account_id);

        accountData.account_no = accountData.account_no
        .slice(-4)
        .padStart(accountData.account_no.length, '*');
        
        const output = template({
        start_date: moment(start_date).format('Do MMMM YYYY'),
        end_date: moment(end_date).format('Do MMMM YYYY'),
        account: accountData,
        transactions: result
        });


        fs.writeFileSync(
            path.join(basePath, 'transactions.html'),
            output,
            (error) => {
                if (error) {
                throw new Error();
                }
            }
        );


        // res.sendFile(path.join(basePath, 'transactions.html'));
        const pdfSize = await generatePDF(basePath);
        res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfSize
        });

        
        res.sendFile(path.join(basePath, 'transactions.pdf'));

    } catch (e) {
        res.status(400).send({
            transactions_error: 'Error while downloading..Try again later.'
        });
    }
})


const getTransactions = async (account_id, start_date, end_date) => {
    
    
    try {
        
        if (start_date && end_date) {
            var startDate = new Date(start_date)
            var endDate   = new Date(end_date)
            const transaction = await Transactions.aggregate([
                {
                    $match: {
                        $and: [{
                            createdAt: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        },{
                            account_id: mongoose.Types.ObjectId(account_id)
                        }

                    ]
                        
                    }
                },
                { $project: {
                    "formatted_date": {
                        $dateToString: { 
                            format: "%Y-%m-%d", date: "$createdAt" 
                        }
                    }, 
                    withdraw_amount: 1,
                    deposit_amount: 1,
                    balance: 1
                }},{
                    $sort :{
                        "formatted_date": -1
                    }
                }
                
            ])

            return transaction
        }else{
            
            const transaction = await Transactions.aggregate([
                {
                    $match: {account_id: mongoose.Types.ObjectId(account_id)}
                },
                { $project: {
                    "formatted_date": {
                        $dateToString: { 
                            format: "%Y-%m-%d", date: "$createdAt" 
                        }
                    }, 
                    withdraw_amount: 1,
                    deposit_amount: 1,
                    balance: 1
                }},{
                    $sort :{
                        "formatted_date": -1
                    }
                }
                
            ])

            console.log(transaction)
            return transaction
        }
        
    } catch (error) {
        return null
    }
}

const getAccountByAccountId = async (account_id) => {
    try {
        
        const account = await Account.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(account_id),
                    }
                }
        ])
        return account[0]
        
    } catch (error) {
        return null
    }
}

const generatePDF = async (filepath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file:${path.join(filepath, 'transactions.html')}`, {
      waitUntil: 'networkidle2'
    });
    await page.setViewport({ width: 1000, height: 1000 });
    const pdfURL = path.join(filepath, 'transactions.pdf');
    await page.addStyleTag({
      content: `
      .report-table { border-collapse: collapse; width:100%; }
      .report-table td, th { border: 1px solid #ddd; padding: 10px; }
      .report-table th { text-align: left; }
      `
    });
    const pdf = await page.pdf({
      path: pdfURL,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:38px;">
                          ${moment(new Date()).format('Do MMMM YYYY')}
                      </div>`,
      footerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:38px;margin-right:35px;width:100%;">
                          <span style="display:inline-block;float:right;margin-right:10px;">
                              <span class="pageNumber"></span> / <span class="totalPages"></span>
                          </span>
                      </div>`,
      margin: {
        top: '1.2cm',
        right: '1.2cm',
        bottom: '1.2cm',
        left: '1.2cm'
      }
    });
    await browser.close();
  
    return pdf.length;
};

module.exports = router