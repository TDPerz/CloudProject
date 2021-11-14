const mongo = require('mongoose');
// const ObjectID = require("bson-objectid");
var cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'sekaijk', 
    api_key: '215974666332244', 
    api_secret: '0pLOXtk0gDqVipHe8JVZdnWHTVw',
    secure: true
});

const clotheSchema = new mongo.Schema({
    title:String,
    img:{
        url:String,
        public_id:String
    },
    desc:String,
    tag:String,
    date:Date,
    cost:String,
    inStock:String,
    comment:[{
        user:String,
        content:String,
        likes:Array,
        dislikes:Array
    }],
    rawRate:Number,
    rates:[{
        user:String,
        rate:Number
    }]
})

/**
 * 
 * @returns Devuelve la lista de todas 
 */
clotheSchema.statics.getAllClothe = async function(){
    const all = await this.find()
    return (all.length != 0) ? all : {"mensaje":"Ropa no encontrada"}
}

/**
 * 
 * @param {string} _id Titulo de la publicacion
 * @returns Devuelve toda la informacion de la publicacion
 */
clotheSchema.statics.getClothe = async function(_id){
    const item = await this.findOne({_id});
    return item
}

/**
 * Funcion para obtener lo ultimos items publicados
 * @returns Devuelve las nuevas noticias de la pagina
 */
clotheSchema.statics.getNews = async function(){
    const item = await this.find().sort({x:-1})
    let dataNew = []
    if(item.length > 3){
        for(var i = 0; i < 3; i++){
            dataNew[i] = item[i]
        }
    }
    else{
        dataNew = item
    }
    return dataNew
}

/**
 * Funcion para editar un objeto de la pagina web
 * @param {string} oldTitle titulo anterior
 * @param {string} title nuevo titulo
 * @param {object} img tiene un publicid y la url de la imagen
 * @param {string} desc nueva descripcion
 * @param {string} tag nuevo tag
 * @param {date} date nueva fecha
 * @param {string} cost costo de la ropa
 * @param {int } inStock cuenatos productos hay en existencia
 * @returns 
 */
clotheSchema.statics.editClothe = async function(_id, title, img, desc, tag, date, cost, inStock){
    let resp = {Status:0, Mensaje:'Datos actualizado'}
    let public_id = (await this.getClothe(_id)).img.public_id
    if(public_id != img.public_id){
        cloudinary.uploader.destroy(public_id, function (error, result){if (error) console.log(error)})
    }
    let a = await this.updateOne({_id}, {title, img, desc, tag, date, cost, inStock}, (err, resu)=>{
        if(err) resp = {Status: -1, Mensaje:'Error, No actualizado'}
        resp = {status:0, Mensaje:"Listo, subido"}
    })
    return resp;
}

/**
 * Funcion para publicar un comentario
 * @param {string} _id Titulo de la publicacion
 * @param {string} user usuario que commento
 * @param {string} content comentario
 * @returns devuelve el status de la operacion
 */
clotheSchema.statics.postComment = async function(_id, user, content){
    let a = await this.updateOne({_id:_id}, { $push: {comment:{user , content, likes:[], dislikes:[]}}})
    return {Status:0, Mensaje:"Listo!"}
}

clotheSchema.statics.editComment = async function(_id, id, content){
    let a = await this.updateOne({_id:_id, "comment._id":id}, {"comment.$.content":content})
    return {Status:0,Messaje:"Ok"}
}

clotheSchema.statics.deleteComment = async function(_id, idc){
    var a = await this.updateOne({_id:_id},{$pull:{comment:{_id:idc}}})
    return {Status:0, Messaje:"Ok"}
}

clotheSchema.statics.setRate = async function(_id, rate, user){
    let pos = await this.findOne({_id})
    index = getExistRate(pos.rates, user)
    var suma = pos.rawRate
    if(index != -1){
        suma = suma - pos.rates[index].rate
        pos.rates[index].rate = rate
        suma = suma += rate
        await this.updateOne({_id, "rate.user":user}, { rawRate:suma, "rate.$.rate": rate})
    }
    else{
        suma = pos.rawRate + rate
        await this.updateOne({_id}, { rawRate:suma, $push:{rates:{user, rate}}})
    }
    return {Status:0, Messaje:"Ok"}
}

clotheSchema.statics.deletRate = async function(_id, user){
    var pos = await this.findOne({_id})
    var resta = 0
    index = getExistRate(pos.rates, user)
    if(index != -1){
        resta = pos.rawRate - pos.rates[index].rate
    }
    // var a = await this.updateOne({_id:_id}, {rawRate:pos.rawRate, rates:pos.rates})
    await this.updateOne({_id}, { rawRate : resta, $pull:{rates:{user}}})
    return {Status:0, Messaje:"Ok"}
}

/**
 * Busca el index donde esta el usuarion en la lista de likes o dislikes
 * @param {list} dislikeList listade dislikes o likes
 * @param {string} user user
 * @returns retorna el index donde esta el nombre de usuario en la lista.
 */
function isDislike(dislikeList, user){
    var found = dislikeList.indexOf(user)
    return found
}

function getCommentID(list, id){
    var found = list.map((e)=>{return e.id}).indexOf(id)
    return found
}

function getExistRate(list, user){
    var found = list.map((e)=>{return e.user}).indexOf(user)
    return found
}

/**
 * Inserta un like a un comentario
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio like
 * @returns retorna el comentario ya actualizado
 */
clotheSchema.statics.likeComment = async function(_id, id, user){
    let ddislike = await this.updateOne({_id:_id, "comment._id":id},{ $pull:{"comment.$.dislikes":user}})
    let slike = await this.updateOne({_id:_id, "comment._id":id},{ $push:{"comment.$.likes":user}})
    return {Status:0, Mensaje:"OK!"}
}

/**
 * elimina un Like de una publicacion
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio like
 * @returns retorna el comentario ya actualizado
 */
 clotheSchema.statics.likenComment = async function(_id, id, user){
    let slike = await this.updateOne({_id:_id, "comment._id":id},{ $pull:{"comment.$.likes":user}})
    return {Status:0, Mensaje:"OK!"}
}

/**
 * Ingresa un dislike a un comentario
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio dislike
 * @returns retorna el comentario ya actualizado
 */
clotheSchema.statics.dislikeComment = async function(_id, id, user){
    let ddislike = await this.updateOne({_id:_id, "comment._id":id},{ $push:{"comment.$.dislikes":user}})
    let slike = await this.updateOne({_id:_id, "comment._id":id},{ $pull:{"comment.$.likes":user}})
    return {Status:0, Mensaje:"OK!"}
}

/**
 * Elimina un dislike de una publicacion
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio dislike
 * @returns retorna el comentario ya actualizado
 */
 clotheSchema.statics.dislikenComment = async function(_id, id, user){
    let ddislike = await this.updateOne({_id:_id, "comment._id":id},{ $push:{"comment.$.dislikes":user}})
    return {Status:0, Mensaje:"OK!"}
}

/**
 * Borra cualquier publicacion de la pagina principal
 * @param {string} _id titulo del post que se quiere borrar
 * @returns retorna el mensaje si se borro o no
 */
clotheSchema.statics.deletClothe = async function(_id){
    let resp = {Status:0, Mensaje:""}
    let public_id = (await this.getClothe(_id)).img.public_id
    cloudinary.uploader.destroy(public_id, function (error, result){if (error) console.log(error)})
    let re = await this.deleteOne({_id: _id}, a = (err,resu)=>{
        if (err) resp = {Status:-1, Mensaje:"Delete error"}
        resp = {Status:0, Mensaje:"Delete succesful"}
        return resp
    })
    return resp
}

module.exports = mongo.model('Clothe',clotheSchema)