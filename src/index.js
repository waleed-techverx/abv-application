const app = require('./app')
const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Server is running on https://localhost:${port}`)
})
