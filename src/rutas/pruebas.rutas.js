'use strict'

const express = require('express');
const pruebasControlador = require('../controladores/pruebas.controlador');

const api = express.Router();

api.put('/incrementarPruebas/:id', pruebasControlador.incrementarPrueba);
api.post('/agregarPruebas', pruebasControlador.agregarPruebas);
api.put('/agregarComidas/:id', pruebasControlador.agregarComidas);
api.post('/agregarDepartamento/:idCiudad', pruebasControlador.agregarDepartamentos);
api.delete('/eliminarCiudadyDep/:idCiudad', pruebasControlador.eliminarCiudadyDepartamentos);
api.get('/obtenerPruebas', pruebasControlador.obtenerPruebas);
api.get('/obtenerComidas/:id', pruebasControlador.obtenerComidas);
module.exports = api;