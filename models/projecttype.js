var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const projectTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
}, {
    timestamps:true
});

module.exports = mongoose.model('ProjectType', projectTypeSchema); 