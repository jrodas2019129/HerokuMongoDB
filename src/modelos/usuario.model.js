'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    username: String,
    email: String,
    password: String,
    rol: String,
    imagen: String
});

module.exports = mongoose.model('usuarios', UsuarioSchema);