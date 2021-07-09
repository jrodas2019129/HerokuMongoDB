'use strict'

// VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

// IMPORTACION DE RUTAS
var usuario_rutas = require("./src/rutas/usuario.rutas");
var encuestas_rutas = require("./src/rutas/encuestas.rutas");
const pruebas_ruta = require("./src/rutas/pruebas.rutas");


// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CABECERAS
app.use(cors());

// APLICACION DE RUTAS  localhost:3000/api/ejemplo
app.use('/api', usuario_rutas, encuestas_rutas, pruebas_ruta);

// EXPORTAR
module.exports = app;