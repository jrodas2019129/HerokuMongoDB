'use strict'

var Pruebas = require('../modelos/pruebas.model');
var Departamentos = require('../modelos/departamentos.model');

function agregarPruebas(req, res) {
    var pruebasModel = new Pruebas();
    var params = req.body;
    if(params.ciudad && params.habitantes){
        pruebasModel.ciudad = params.ciudad;
        pruebasModel.habitantes = params.habitantes;
        pruebasModel.totalComidaCasa = 0;

        pruebasModel.save((err, pruebaGuardad)=>{
            return res.status(200).send({pruebaGuardad})
        })
    }
}

function incrementarPrueba(req, res){
    var params = req.body;
    var pruebaId = req.params.id;
    var nacimientos = Number(params.nacimientos);
    

    Pruebas.findByIdAndUpdate(pruebaId, { $inc: { habitantes: nacimientos }}, {new: true}, (err, pruebasEditadas)=>{

        return res.status(200).send({ pruebasEditadas: pruebasEditadas})

    })
}

function agregarComidas(req, res){
    var params = req.body;
    var idPruebas = req.params.id;
    var totalSumado = 0;

    Pruebas.findByIdAndUpdate(idPruebas, { $push: { comidaCasa: { nombreComida: params.nombreComida, precioComida: params.precioComida } } }, 
        {new: true}, (err, comidaAgregada) => {
            if (comidaAgregada.comidaCasa.length > 0) {
                for (let i = 0; i < comidaAgregada.comidaCasa.length; i++) {
                    totalSumado = totalSumado + comidaAgregada.comidaCasa[i].precioComida;
                }
                /* comidaAgregada.comidaCasa.forEach(element => {
                    totalSumado = totalSumado + element.precioComida;
                }); */
            }
            Pruebas.findByIdAndUpdate(idPruebas, { totalComidaCasa: totalSumado }, {new: true}, (err, totalAgregado) => {
                return res.status(200).send({ final: totalAgregado})
            });            
        })
}

function agregarDepartamentos(req, res){
    var departamentosModel = new Departamentos();
    var params = req.body;
    var idCiudad = req.params.idCiudad;

    if(params.nombreDepartamento){
        departamentosModel.nombreDepartamento = params.nombreDepartamento;
        departamentosModel.idCiudad = idCiudad;

        departamentosModel.save((err, departamentoGuardado)=>{
            return res.status(200).send({departamentoGuardado})
        })
    }
}

function eliminarCiudadyDepartamentos(req, res){
    var idCiudadRuta = req.params.idCiudad;

    Pruebas.findByIdAndDelete(idCiudadRuta, (err, ciudadEliminada)=>{
        Departamentos.deleteMany({ idCiudad: idCiudadRuta }, (err, departamentoEliminados)=>{
            return res.status(200).send({eliminados: departamentoEliminados})
        })
    })
}

function obtenerPruebas(req, res) {
    Pruebas.find().exec((err, pruebasObtenidas)=>{
        return res.status(200).send({pruebasObtenidas: pruebasObtenidas})
    })
}

function obtenerComidas(req, res) {
    var idPruebas = req.params.id;
    Pruebas.findById(idPruebas, { comidaCasa: 1 }, (err, comidasObtenidas)=>{
        return res.status(200).send({ comidasObtenidas: comidasObtenidas});
    })
}

module.exports ={
    incrementarPrueba,
    agregarPruebas,
    agregarComidas,
    agregarDepartamentos,
    eliminarCiudadyDepartamentos,
    obtenerPruebas,
    obtenerComidas
}