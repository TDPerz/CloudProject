const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const ms = require('mailgun-js')({apiKey:process.env.APIKEY, domain:process.env.DOMAINS})
var MailComposer = require('nodemailer/lib/mail-composer');
const authRout = express.Router();

authRout.post('/login', async (req,res)=>{
    const {email, password, remember} = req.body
    let foundUser = await User.Login(email,password)
    if(foundUser.Token){
        if(remember){
            foundUser.Token = jwt.sign(foundUser.Token, process.env.SECRET_KEY)
        }
        else{
            foundUser.Token = jwt.sign(foundUser.Token, process.env.SECRET_KEY, {expiresIn:'24h'})
        }
        res.json(foundUser)
    }
    else{
        res.json(foundUser)
    }
})

authRout.post('/register', async (req, res)=>{
    let {user, name, email, password} = req.body
    let role = "User"
    const newUser = new User({user, name, email, role, password})
    await newUser.save()
    let token = jwt.sign({user, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
    res.json({Status:0, Mensaje:"User Create", Token:token})
})

authRout.get('/activate/:email', async (req, res)=>{
    var token = Math.floor(1000 + Math.random() * 9000);
    var email = req.params.email
    var mailopt = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: email,
        subject:"Activacion de cuenta",
        text: "Token de activacion de cuenta es:" + token + "\ncopia lo y pegalo para lograr activar tu cuenta"
    }
    var mail = new MailComposer(mailopt)
    mail.compile().build(function(erro, message){
        var dataSend = {
            to: email,
            message: message.toString('ascii')
        }
        console.log(dataSend)
        ms.messages().sendMime(dataSend, (erro, body)=>{
            if (erro) {
                console.log(erro);
                return;
            }
            else{
                console.log(body)
            }
        })
    })
    res.json({Status:0, Mensaje:"User Create", Token:token})
})

module.exports = authRout

module.exports.requireLogin = async (req, res, next)=>{
    if(!req.headers.autho){
        return res.json({Status: 100, Mensaje:"TOKEN INVALIDO"})
    }
    const tokenContent = req.headers.autho.substr(7)
    if(tokenContent != ""){
        const token = (jwt.verify(tokenContent, process.env.SECRET_KEY))
        const resp = await User.exists(token)
        if(resp){
            next()
        }
        else{
            return res.json({Status: 100, Mensaje:"TOKEN INVALIDO"})
        }
    }
    else{
        return res.json({Status: 100, Mensaje:"TOKEN INVALIDO"})
    }
}