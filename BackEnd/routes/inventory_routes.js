const express = require('express')
const Items = require('../models/item')
const auth = require('./authentic')
const routes = express.Router();


routes.get('/', auth.requireLogin, (req, res)=>{
    res.json({Status:0,Mensaje:"you can continum"})
})

routes.get('/inventory', auth.requireLogin , async(req, res)=>{
    const item = await Items.getAll()
    res.json({Status:0, Mensaje:"Listo", itemsList: item})
})

routes.post('/inventory/add', auth.requireLogin, async(req, res)=>{
    const{id_Name, tag, cost, inStock} = req.body
    const newItem = new Items({id_Name, tag, cost, inStock})
    await newItem.save()
    res.json({status:0, Mensaje:"Succesful"})
})

routes.put('/inventory/modfic/:_id', auth.requireLogin , async(req, res)=>{
    const {id_Name, tag, cost, inStock } = req.body
    console.log(req.params._id)
    const devMen = await Items.updateItem(req.params._id, id_Name, tag, cost, inStock)
    res.json(devMen)
})

routes.delete('/inventory/delete/:_id',auth.requireLogin, async(req,res)=>{
    const id_Name = req.params._id
    const resp = await Items.deleteItem(id_Name)
    res.json(resp)
})

module.exports = routes