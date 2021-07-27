const mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator')

const postSchema = new mongoose.Schema({
    userId : {
        type : String, 
        required : true,
    },
    desc : {
        type : String,
        max : 50,
    },
    img : {
        type : String,
    },
    likes : {
        type : Array,
        deafault : [],
    }
},
{
    timestamps : true
}
)

// userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Post', postSchema);