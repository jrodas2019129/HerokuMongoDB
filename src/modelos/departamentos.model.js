'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DepartamentosSchema = Schema({
    nombreDepartamento: String,
    idCiudad: { type: Schema.Types.ObjectId, ref:'Pruebas'}
});

module.exports = mongoose.model('Departamentos', DepartamentosSchema);