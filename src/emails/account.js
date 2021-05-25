const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomMail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'waleed.mazhar@techverx.com',
        subject: 'This is my first Email!',
        text: 'Welcome to our Task Manager Application'
    })
}

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'waleed.mazhar@techverx.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}, Hope to see you soon`
    })
}

module.exports = {
    sendWelcomMail,
    sendCancelationEmail
}

