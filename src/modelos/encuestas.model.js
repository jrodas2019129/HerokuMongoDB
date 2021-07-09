'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EncuestaSchema = Schema({
    tituloEncuesta: String,
    descripcionEncuesta: String,
    opinion: {
        si: Number,
        no: Number,
        ninguna: Number,
        usuariosEncuestados: []
    },
    listaComentarios: [{
        textoComentario: String,
        comentarioUsuarioId: { type: Schema.Types.ObjectId, ref: 'usuarios' }
    }],
    usuarioEncuesta: { type: Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('encuestas', EncuestaSchema);