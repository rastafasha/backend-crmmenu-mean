const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    // Básico
    name: { type: String, required: true, unique: true },
    num_whatsapp: { type: String, required: false },
    url: { type: String, required: true },
    rrss: { type: String, required: true },
    img: { type: String, required: false },
    ubicacion: { type: String, required: true },
    hasVisited: { type: Boolean, required: false, default: false }, // Corregido 'require' a 'required'
    hasMenu: { type: Boolean, required: false, default: false },    // Corregido 'require' a 'required'
    tipoMenu: { type: String, required: true },
    
    // Fechas corregidas a tipo Date para poder hacer reportes/filtros reales en el CRM
    dateVisita: { type: Date, required: false, default: Date.now },
    dateAprobado: { type: Date, required: false, default: Date.now },
    
    partners: { type: Array, required: false },
    status: { type: Boolean, required: false, default: false },     // Corregido 'require' a 'required'
    category: { type: Schema.Types.ObjectId, ref: "categoria" },     // Corregido Schema.ObjectId
    pais: { type: Schema.Types.ObjectId, ref: "pais" },               // Corregido Schema.ObjectId

    // Propuesta enviada
    negociacion: { type: String, required: false },
    propuesta: { type: String, required: false },
    notificado: { type: Boolean, required: false, default: false }, // Corregido 'require' a 'required'
    
    // Si respondió (Seguimiento del Pipeline)
    // Cambiado a String para usarlo como estado dinámico en tu selector del CRM
    estado_seguimiento: { 
      type: String, 
      required: false, 
      enum: ['PENDIENTE', 'INTERESADO_ESPERA_DATOS', 'CORREO_ENVIADO', 'RECHAZADO'],
      default: 'PENDIENTE' 
    },
    email_contacto: { type: String, required: false },
    canal_origen: { type: String, required: false }, // 'Instagram (DM)', 'WhatsApp Directo', 'En Persona'
    correo_enviado: { type: String, required: false, default: false } // Cambiado a Boolean
  },
  {
    timestamps: true, // Te crea automáticamente createdAt y updatedAt
  }
);

module.exports = mongoose.model("Project", projectSchema);
