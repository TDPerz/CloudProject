const mongo = require('mongoose')

const itemSchema = new mongo.Schema({
    id_Name:String,
    tag:String,
    cost:String,
    inStock:String
})

itemSchema.statics.getAll = async function(){
    const all = await this.find()
    if(all.length == 0 ){
        return {Status:-1, Mensaje:"No hay item aun"}
    }
    else{
        return all
    }
}

itemSchema.statics.updateItem = async function(_id, id_Name, tag, cost, inStock){
    let resp = {Status:0, Mensaje:'Dato Actualizado'}
    await this.updateOne({_id: _id}, {id_Name, tag, cost, inStock}, (err, resu)=>{
        if(err) resp = {Status:-1, Mensaje:'Error, No se actualizo bien'}
        resp = {Status:0, Mensaje:'Dato Actualizado'}
    })
    return resp
}

itemSchema.statics.deleteItem = async function(id_Name){
    let resp = {Status:0, Mensaje:"sucess delete"}
    await this.deleteOne({_id:id_Name}, (err, resu)=>{
        if(err) resp = {Status:-1, Mensaje:"Error al borrar"}
        resp = {Status:0, Mensaje:"sucess delete"}
    })
    return resp
}

module.exports = mongo.model('Inventori', itemSchema)