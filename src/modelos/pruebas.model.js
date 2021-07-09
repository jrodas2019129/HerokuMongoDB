'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PruebasSchema = Schema({
    ciudad: String,
    habitantes: Number,
    comidaCasa: [{
        nombreComida: String,
        precioComida: Number
    }],
    totalComidaCasa: Number
});

module.exports = mongoose.model('Pruebas', PruebasSchema);