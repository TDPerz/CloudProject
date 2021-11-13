const mongo = require('mongoose');

const NewsSchema = new mongo.Schema({
    title:String,
    desc:String,
    img:{
        url:String,
        public_id:String
    }
})

NewsSchema.statics.getNews = async function(){
    const n = await this.find()
    return n
}

module.exports = mongo.model('New',NewsSchema)