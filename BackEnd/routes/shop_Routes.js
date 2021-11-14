const express = require('express');
const ViewItems = require('../models/viewItem');
const News = require('../models/new')
const auth = require('./authentic');
const jwt = require('jsonwebtoken')
const viewItem = require('../models/viewItem');
const routes = express.Router();

routes.get('/news', async (req, res)=>{
    let data = new Array()
    let a = await viewItem.getNews()
    let b = await News.getNews()
    data = a.concat(b);
    res.json({Status:0, Mensaje:"News", news:data})
})

routes.get('/clothe', async (req, res)=>{
    const clothes = await ViewItems.getAllClothe()
    res.json({Status:0, Mensaje:'Ok', itemsList: clothes})
})

routes.get('/clothe/:_id', async (req, res)=>{
    const item = await ViewItems.getClothe(req.params._id)
    res.json({Status:0, Mensaje:'Ok', item:item})
})

routes.get('/clothe/:_id/ratent', auth.requireLogin, async(req, res)=>{
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    var resp = await ViewItems.deletRate(req.params._id, token.user)
    res.json(resp)
})

routes.get('/clothe/:_id/comment/like/:id', auth.requireLogin, async(req, res)=>{
    const _id = req.params._id
    const id = req.params.id
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    let resp = await ViewItems.likeComment(_id, id, token.user)
    res.json(resp)
})

routes.get('/clothe/:_id/comment/likent/:id', auth.requireLogin, async(req, res)=>{
    const _id = req.params._id
    const id = req.params.id
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    let resp = await ViewItems.likenComment(_id, id, token.user)
    res.json(resp)
})

routes.get('/clothe/:_id/comment/dislike/:id', auth.requireLogin, async(req, res)=>{
    const _id = req.params._id
    const id = req.params.id
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    let resp = await ViewItems.dislikeComment(_id, id, token.user)
    res.json(resp)
})

routes.get('/clothe/:_id/comment/dislikent/:id', auth.requireLogin, async(req, res)=>{
    const _id = req.params._id
    const id = req.params.id
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    let resp = await ViewItems.dislikenComment(_id, id, token.user)
    res.json(resp)
})

routes.post('/clothe/add', auth.requireLogin, async(req, res)=>{
    const{title, img, desc, tag, date, cost, inStock} = req.body
    const newItemBuy = new ViewItems({title, img, desc, tag, date, cost, inStock, rawRate:0,rates:[],comment:[]})
    await newItemBuy.save()
    res.json({Status:0, Mensaje:"Succesful"})
})

routes.post('/clothe/:_id/rate', auth.requireLogin, async(req,res)=>{
    const{rate} = req.body
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    var resp = await ViewItems.setRate(req.params._id, rate, token.user)
    res.json(resp)
})

routes.post('/clothe/:_id/comment', auth.requireLogin, async(req, res)=>{
    const content  = req.body.content
    const token = (jwt.verify(req.headers.autho.substr(7), process.env.SECRET_KEY))
    const resp = await ViewItems.postComment( req.params._id, token.user , content)
    res.json(resp)
})

routes.put('/clothe/:_id/comment/edit/:id', auth.requireLogin, async(req,res)=>{
    const {content, id} = req.body
    const resp = await ViewItems.editComment(req.params._id, req.params.id ,content)
    res.json(resp)
})

routes.put('/clothe/edit/:_id', auth.requireLogin, async(req, res)=>{
    const _id = req.params._id
    const{title, img, desc, tag, date, cost, inStock} = req.body
    let result = await ViewItems.editClothe(_id, title, img, desc, tag, date, cost, inStock)
    res.json(result)
})

routes.delete('/clothe/delete/:_id', auth.requireLogin, async(req,res)=>{
    const _id = req.params._id
    const resp = await ViewItems.deletClothe(_id)
    res.json(resp)
})

routes.delete('/clothe/:_id/comment/:id', auth.requireLogin, async(req, res)=>{
    const resp = await ViewItems.deleteComment(req.params._id, req.params.id)
    res.json(resp)
})

module.exports = routes