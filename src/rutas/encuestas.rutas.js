'use strict'

var express = require('express');
var encuestaControlador = require('../controladores/encuesta.controlador');

// MIDDLEWARES === INTERMEDIARIO
var md_autorizacion = require('../middlewares/authenticated');

// RUTAS
var app = express.Router();
app.post('/agregarEncuesta', md_autorizacion.ensureAuth, encuestaControlador.agregarEncuestas);
app.put('/comentarEncuesta/:idEncuesta', md_autorizacion.ensureAuth, encuestaControlador.comentarEncuesta);
app.put('/editarComentario/:idEncuesta/:idComentario', md_autorizacion.ensureAuth ,encuestaControlador.editarComentario);
app.get('/obtenerComentario/:idComentario', md_autorizacion.ensureAuth, encuestaControlador.obtenerComentario);
app.put('/eliminarComentario/:idComentario', md_autorizacion.ensureAuth, encuestaControlador.eliminarComentario);
app.get('/obtenerEncuestas', md_autorizacion.ensureAuth, encuestaControlador.obtenerEncuestas);

module.exports = app;