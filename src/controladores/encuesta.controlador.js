'use strict'

var Encuesta = require('../modelos/encuestas.model');

function obtenerEncuestas(req, res) {
    Encuesta.find().populate('usuarioEncuesta', 'email username imagen').exec((err, encuestasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de obtener Encuestas' });
        if(!encuestasEncontradas) return res.status(500).send({ mensaje: 'Error al obtener las Encuestas' });
        return res.status(200).send({ encuestasEncontradas })
    })
}


function agregarEncuestas(req,res) {
   var encuestaModel = new Encuesta();
   var params = req.body; 

   if(params.tituloEncuesta && params.descripcionEncuesta){
       encuestaModel.tituloEncuesta = params.tituloEncuesta;
       encuestaModel.descripcionEncuesta = params.descripcionEncuesta;
       encuestaModel.usuarioEncuesta = req.user.sub;
       encuestaModel.opinion = {
           si: 0,
           no: 0,
           ninguna: 0,
           usuariosEncuestados: []
       }

       encuestaModel.save((err, encuestaGuardada)=>{
           if(err) return res.status(500).send({ mensaje: 'Error en la peticion de la Encuesta' });
           if(!encuestaGuardada) return res.status(500).send({ mensaje: 'Error al agregar la encuesta' });

           return res.status(200).send({ encuestaGuardada })
       })
   }else{
       return res.status(500).send({mensaje: "Rellene todos los datos necesarios"})
   }
}

function comentarEncuesta(req, res) {
    var encuestaId = req.params.idEncuesta;
    var params = req.body;

    Encuesta.findByIdAndUpdate(encuestaId, 
        { $push: { listaComentarios: { textoComentario: params.textoComentario, comentarioUsuarioId: req.user.sub } } },
        {new: true}, (err, comentarioGuardado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion del Comentario en Encuestas' });
            if(!comentarioGuardado) return res.status(500).send({mensaje: 'Error al guardar el comentario'});

            return res.status(200).send({ comentarioGuardado })
        })
}

function editarComentario(req, res) {
    var encuestaId = req.params.idEncuesta;
    var comentarioId = req.params.idComentario;
    var params = req.body;
    var datosPorActualizar = {}; 
  
    if(params.textoComentario) datosPorActualizar['listaComentarios.$.textoComentario'] = params.textoComentario;    

    // {_id: "asdfadsfa", textoComentario: "Hola esto es un ejemplo", idUsuario: "adfsasfasghklvb"}
    Encuesta.findOneAndUpdate( { _id: encuestaId, "listaComentarios._id": comentarioId }, datosPorActualizar, {new:true}, 
    (err, encuestaActualizada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion del Comentario' });
        if(!encuestaActualizada) return res.status(500).send({mensaje: 'Error al editar el comentario'});

        return res.status(200).send({ encuestaActualizada });
    })
}

function obtenerComentario(req, res) {
    var comentarioId = req.params.idComentario;

    Encuesta.findOne({ "listaComentarios._id": comentarioId }, { "listaComentarios.$": 1, tituloEncuesta: 1, descripcionEncuesta: 1 } ,(err, comentarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Comentario'});
        if(!comentarioEncontrado) return res.status(500).send({mensaje: 'Error al obtener le Comentario' });

        return res.status(200).send({ comentarioEncontrado });
    })
}

function eliminarComentario(req, res) {
    var comentarioId = req.params.idComentario;

    Encuesta.findOneAndUpdate({ "listaComentarios._id": comentarioId }, { $pull: { listaComentarios: { _id: comentarioId } } }, {new: true},
    (err, encuestaActualizada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de comentario' });
        if(!encuestaActualizada) return res.status(500).send({ mensaje: 'Error al eliminar el Comentario' });

        return res.status(200).send({ encuestaActualizada })
    })
}

module.exports = {
    agregarEncuestas,
    comentarEncuesta,
    editarComentario,
    obtenerComentario,
    eliminarComentario,
    obtenerEncuestas
}