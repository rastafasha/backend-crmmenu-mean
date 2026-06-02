var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true },
    num_whatsapp: { type: String, required: false },
    url: {
      type: String,
      required: true,
    },
    rrss: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    propuesta: {
      type: String,
      required: false,
    },
    negociacion: {
      type: String,
      required: false,
    },
    partners: {
      type: Array,
      required: false,
    },
    status: { type: Boolean, require: false, default: false },
    category: { type: Schema.ObjectId, ref: "categoria" },
    pais: { type: Schema.ObjectId, ref: "pais" },
    hasVisited: { type: Boolean, require: false, default: false },
    notificado: { type: Boolean, require: false, default: false },
    hasMenu: { type: Boolean, require: false, default: false },
    tipoMenu: {
      type: String,
      required: true,
    },
    dateVisita: {
      type: String,
      required: false,
      default: Date.now,
    },
    dateAprobado: {
      type: String,
      required: false,
      default: Date.now,
    },
    
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
