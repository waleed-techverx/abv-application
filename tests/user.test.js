const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const Token = require('../src/models/tokens')
const { userOneId,
    userOne,
    userTwoId,
    userTwo,
    accountOne,
    accountTwo,
    tokenOne,
    tokenTwo,
    setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new User', async()=>{
    const response = await request(app).post('/signup').send({
        first_name: 'Ahsan',
        last_name: 'Raza',
        email: 'ahsan@gmail.com',
        password: 'abcd1234'
    }).expect(201)

    // Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about response
    expect(response.body).toMatchObject({
        user:{
            first_name: 'Ahsan',
            email: 'ahsan@gmail.com'
        }
    })

    expect(user.password).not.toBe('mypassAbcd12')


})


test('Should login existing User', async()=>{
    const response = await request(app).post('/signin').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // const user = await User.findById(userOneId)
    const token = await Token.findOne({access_token: response.body.token})
    expect(response.body.token).toBe(token.access_token)
})

test('Should not sign in non existant User', async()=>{
    await request(app).post('/signin').send({
        email: userOne.email,
        password: "thisismypass"
    }).expect(400)
})

test('Should get profile of the user', async()=>{
    await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${tokenOne.access_token}`)
        .send()
        .expect(200)
    
})

test('Should update prfile of the user', async()=>{
    await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${tokenOne.access_token}`)
        .send({
            first_name: 'Ahmad',
            last_name: "Bilal"
        })
        .expect(201)
    
})


test('Should Logout a user', async()=>{

    await request(app)
        .post('/profile')
        .set('Authorization', `Bearer ${tokenOne.access_token}`)
        .send()
        .expect(201)
    
})

test('Should not get profile for unauthenticated user', async()=>{
    await request(app)
        .get('/profile')
        .send()
        .expect(401)
    
})

// test('Should delete account for user', async()=>{
//     const response = await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
    
//     const user = await User.findById(userOneId)
//     expect(user).toBeNull()
// })

// test('Should not delete account for unauthenticated user', async()=>{
//     await request(app)
//         .delete('/users/me')
//         .send()
//         .expect(401)
    
// })


// test('Should upload avatar image', async()=>{
//     const response = await request(app)
//         .post('/users/me/avatar')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar','tests/fixtures/profile-pic.jpg')
//         .expect(200)

//     const user = await User.findById(userOneId)
//     expect(user.avatar).toEqual(expect.any(Buffer))
    
    
// })

// test('Should update valid fields', async()=>{
//     const response = await request(app)
//         .patch('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             name: 'Ahsan'
//         })
//         .expect(200)

//     const user = await User.findById(userOneId)
//     expect(user.name).toEqual('Ahsan')
    
// })

// test('Should not update invalid fields', async()=>{
//     await request(app)
//         .patch('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             location: 'Phil'
//         })
//         .expect(400)
    
// })