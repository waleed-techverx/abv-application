const app = require('./app')
const port = process.env.PORT  || 3000
const path = require('path')
const express = require('express')


if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port, ()=>{
    console.log(`Server is running on https://localhost:${port}`)
})
