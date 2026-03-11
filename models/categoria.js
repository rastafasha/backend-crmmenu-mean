var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: { type: String, required: true },
    project: { type: Schema.ObjectId, ref: 'project' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('categoria', CategoriaSchema);