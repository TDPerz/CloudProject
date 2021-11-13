const mongo = require('mongoose');
const ObjectID = require("bson-objectid");
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
    comment:Array,
    rawRate:Number,
    rates:Array
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
    let a = await this.updateOne({_id:_id}, { $push: {comment:{id:new ObjectID(), user , content, likes:[], dislikes:[]}}})
    return {Status:0, Mensaje:"Listo!"}
}

clotheSchema.statics.editComment = async function(_id, id, content){
    let pos = await this.findOne({_id})
    index = getCommentID(pos.comment, id)
    pos.comment[index].content = content
    let a = await this.updateOne({_id:_id}, {"comment":pos.comment})
    return {Status:0,Messaje:"Ok"}
}

clotheSchema.statics.deleteComment = async function(_id, idc){
    let pos = await this.findOne({_id:_id})
    index = getCommentID(pos.comment, idc)
    pos.comment.splice(index, 1)
    var a = await this.updateOne({_id:_id},{comment:pos.comment})
    return {Status:0, Messaje:"Ok"}
}

clotheSchema.statics.setRate = async function(_id, rate, user){
    let pos = await this.findOne({_id})
    if(pos.rates){
        index = getExistRate(pos.rates, user)
        if(index != -1){
            pos.rawRate -= pos.rates[index].rate
            pos.rates[index].rate = rate
            pos.rawRate += rate
        }
        else{
            pos.rates.push({user, rate})
            pos.rawRate += rate
        }
        let a = await this.updateOne({_id:_id}, {rawRate:pos.rawRate, rates:pos.rates})
    }else{
        pos.rates.push({user, rate})
        pos.rawRate = rate + 0
        console.log(pos.rates, pos.rawRate)
        console.log(pos)
        let a = await this.updateOne({_id:_id}, {rawRate:pos.rawRate, rates:pos.rates})
    }
    return {Status:0, Messaje:"Ok"}
}

clotheSchema.statics.deletRate = async function(_id, user){
    var pos = await this.findOne({_id})
    if(pos.rates.length !=0){
        index = getExistRate(pos.rates, user)
        if(index != -1){
            pos.rawRate -= pos.rates[index].rate
            pos.rates.splice(index, 1)
        }
    }
    var a = await this.updateOne({_id:_id}, {rawRate:pos.rawRate, rates:pos.rates})
    return {Stastus:0, Messaje:"Ok"}
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
    let d = await this.findOne({_id:_id})
    var index = getCommentID(d.comment, id)
    var found = isDislike(d.comment[index].dislikes, user)
    if(found  != -1){
        d.comment[index].dislikes.splice(found, 1)
    }
    if(d.comment[index].likes){
        d.comment[index].likes.push(user)
    }else{
        d.comment[index].likes = [user]
    }
    let a = await this.updateOne({_id:_id}, {comment:d.comment})
    return {Status:0, Mensaje:"OK!", Comment:d.comment[id]}
}

/**
 * elimina un Like de una publicacion
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio like
 * @returns retorna el comentario ya actualizado
 */
 clotheSchema.statics.likenComment = async function(_id, id, user){
    let d = await this.findOne({_id:_id})
    var index = getCommentID(d.comment, id)
    var found = isDislike(d.comment[index].likes, user)
    if(found  != -1){
        d.comment[index].likes.splice(found, 1)
    }
    let a = await this.updateOne({_id:_id}, {comment:d.comment})
    return {Status:0, Mensaje:"OK!", Comment:d.comment[id]}
}

/**
 * Ingresa un dislike a un comentario
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio dislike
 * @returns retorna el comentario ya actualizado
 */
clotheSchema.statics.dislikeComment = async function(_id, id, user){
    let d = await this.findOne({_id:_id})
    var index = getCommentID(d.comment, id)
    var found = isDislike(d.comment[index].likes, user)
    if(found  != -1){
        d.comment[index].likes.splice(found, 1)
    }
    if(d.comment[index].dislikes){
        d.comment[index].dislikes.push(user)
    }else{
        d.comment[index].dislikes = [user]
    }
    let a = await this.updateOne({_id:_id}, {comment:d.comment})
    return {Status:0, Mensaje:"OK!", Comment:d.comment[id]}
}

/**
 * Elimina un dislike de una publicacion
 * @param {string} _id titulo de la publicacion
 * @param {int} id id del comentario
 * @param {string} user nombre de usuarioque dio dislike
 * @returns retorna el comentario ya actualizado
 */
 clotheSchema.statics.dislikenComment = async function(_id, id, user){
    let d = await this.findOne({_id:_id})
    var index = getCommentID(d.comment, id)
    var found = isDislike(d.comment[index].dislikes, user)
    if(found  != -1){
        d.comment[index].dislikes.splice(found, 1)
    }
    let a = await this.updateOne({_id:_id}, {comment:d.comment})
    return {Status:0, Mensaje:"OK!", Comment:d.comment[id]}
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