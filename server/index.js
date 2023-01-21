const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { json } = require('express');
require('dotenv').config()
const { Schema } = mongoose;

const secretKey = 'morendin/dette-er-en-test-nøkkel/morendin';

const PORT = process.env.PORT || 3001

const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }))

let messageList = []

const userSchema = new Schema({
    username: String,
    password: String
})
const messageSchema = new Schema({
    username: String,
    message: String,
})

let userInfo = ""
const Users = mongoose.model("User", userSchema)
const Messages = mongoose.model("Messages", messageSchema)


const changeStream = Messages.watch();

changeStream.on('change', async (event) => {
    if (event.operationType === 'insert') {
      const messages = await Messages.find();
      console.log(messages)
      messageList = messages
    }
});


app.get('/api/post_message', (req, res) =>{

    res.json({message: messageList})
})

app.post("/api/register", async (req, res) =>{
    let found = true
    formData = req.body
    try{
        const query = Users.find({username: formData.username});
        const data = await query.exec();
        data.length >= 1 ? found = false: found = true 
    } catch(err){
        return console.error(err)
    }
    if(found == true){
    const user = new Users({username: formData.username, password: formData.password})
    user.save((err, data) =>{
        if(err) return console.error(err)
    })
    res.json({isValid: true})
    }
    else{
        res.json({error: "Username is already taken. Go back to the register page"})
    }
})
app.post("/api/login",  async (req, res) =>{
    let check = false
    let isValid = false
    let formData = req.body
    try{
        const query = Users.find({username: formData.username, password: formData.password });
        const data = await query.exec();
        data.length > 0 ? check = true: check = false
        if(check == true){
            if(data[0].password == formData.password){
                isValid = true
                const payload = {username: formData.username};
                const options = {expiresIn: '60s'};
                const token = jwt.sign(payload, secretKey, options);
                res.json({isValid: true, token});
            }
            else{
                res.json({isValid: false})
            }
        }
        
    } catch(err){
        return console.error(err)
    }
    
})

app.post("/api/home", (req,res) =>{
    userInfo = req.body
    jwt.verify(userInfo.token, secretKey, (err, verifiedJwt) => {
        if(err){
            res.json({expired: true})
        }else{
            console.log(verifiedJwt)
            res.json({token:verifiedJwt, expired: false})
        }
      })
})
app.post("/api/messages", (req, res) =>{
    let messageData = req.body
    const message = new Messages({username: messageData.username, message: messageData.message})
    message.save((err, data) =>{
        if(err) return console.error(err)
    })
})
app.get("/api/home", (req,res) =>{
    res.json(userInfo)
})
app.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`)
})