const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Account = require('../../src/models/account')
const Token = require('../../src/models/tokens')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    first_name: 'Waleed',
    last_name: 'Mazhar',
    email: 'waleed@gmail.com',
    password: 'abcd1234',
    type: 'user',
    age: 27
}

const tokenOne = {
    _id: new mongoose.Types.ObjectId(),
    access_token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    userid: userOne._id
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    first_name: 'Haider',
    last_name: 'Abrar',
    email: 'haider@gmail.com',
    password: 'abcd1234',
    type: 'user',
    age: 17
}

const tokenTwo = {
    _id: new mongoose.Types.ObjectId(),
    access_token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    userid: userTwo._id
}

const accountOne = {
    _id: new mongoose.Types.ObjectId(),
    account_no: 'AB123456',
    bank_name: 'Allied Bank',
    code: 'ABCD',
    userid: userOne._id,
    total_balance: 20000
}


const accountTwo = {
    _id: new mongoose.Types.ObjectId(),
    account_no: 'HB123456',
    bank_name: 'HBL',
    code: '1234',
    userid: userTwo._id,
    total_balance: 10000
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Account.deleteMany()
    await Token.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Account(accountOne).save()
    await new Account(accountTwo).save()
    await new Token(tokenOne).save()
    await new Token(tokenTwo).save()
    
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    accountOne,
    accountTwo,
    tokenOne,
    tokenTwo,
    setupDatabase
}