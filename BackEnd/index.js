require('dotenv').config()
const express = require('express')
const bcrypt = require ('bcrypt')
const mongoose = require('mongoose')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

// var cloudinary = require('cloudinary').v2;

// cloudinary.config({ 
//     cloud_name: 'sekaijk', 
//     api_key: '215974666332244', 
//     api_secret: '0pLOXtk0gDqVipHe8JVZdnWHTVw',
//     secure: true
// });

// cloudinary.search.expression('folder:VentaRopa/*').sort_by('public_id','desc').max_results(30).execute().then(result=>console.log(result));


//Settings

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '3000'

mongoose.connect(process.env.MONGOCLUSTER, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("OH NO ERROR!!!!")
    console.log(err)
})

//MideWare

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())
app.use(session({
    secret:'secretU',
    resave:true,
    saveUninitialized:true
}))

//Routes

app.use(require('./routes/inventory_routes'))
app.use(require('./routes/authentic'))
app.use(require('./routes/shop_Routes'))

// Listen

app.listen(port, host, ()=>{
    console.log('Servidor Iniciado!!')
})