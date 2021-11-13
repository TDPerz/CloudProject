const mongo = require('mongoose')
const bcrypt = require('bcrypt')

const userS = new mongo.Schema({
    user:String,
    name:String,
    role:String,
    email:String,
    password:String
})

userS.statics.Login = async function(email, password){
    const foundUser = await this.findOne({email})
    if(foundUser != null){
        if(await bcrypt.compare(password, foundUser.password) ){
            const token = { user: foundUser.user, email: foundUser.email, role:foundUser.role}
            return {Status:0, Mensaje: "Sucesful", Token: token}
        }else{
            return {Status:-1, Mensaje: "Contraseña no correcta"}
        }
    }else{
        return {Status:-1, Mensaje: "Usuario no encontrado"}
    }
}

userS.statics.exists = async function(token){
    const foundUser = await this.findOne({'user': token.user})
    if(foundUser != null){
        return true
    }
    else{
        return false
    }
}

userS.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

module.exports = mongo.model('User', userS)