require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const accountRouter = require('./routers/account')
const transactionsRouter = require('./routers/transactions')

const app = express()


app.use(express.json())
app.set('view engine', 'ejs');
app.use(userRouter)
app.use(accountRouter)
app.use(transactionsRouter)

module.exports = app