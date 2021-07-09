'use strict'
// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var fs = require('fs');
var path = require('path');

function ejemplo(req, res) {
    if (req.user.rol === "ROL_USUARIO") {
        res.status(200).send({ mensaje: `Hola mi nombre es: ${req.user.nombre}` })
    } else {
        res.status(400).send({ mensaje: 'Solo el rol de tipo usuario puede acceder' })
    }

}

function registrar(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;
    console.log(params);
    if (params.email && params.username && params.password) {
        //     Modelo Base de datos= los datos del cuerpo de datos/formulario
        usuarioModel.nombre = params.nombre;
        usuarioModel.username = params.username;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_USUARIO';
        usuarioModel.imagen = null;

        Usuario.find({
            $or: [
                { username: usuarioModel.username },
                { email: usuarioModel.email }
            ]
        }).exec((err, usuariosEncontrados) => {
            //tiene datos = true || no tiene datos = falso
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuarios' });

            if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya se encuentra utilizado' });
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {

                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Guardar Usuario' });

                        if (usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido registrar el usuario' })
                        }
                    })
                })
            }
        })

    }
}

function obtenerUsuarios(req, res) {
    /* 
        Usuario.find({}, (err, usuarios)=>{})
        Usuario.find((err, usuarios)=>{})
    */

    Usuario.find().exec((err, usuarios) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de obtener Usuarios' });
        if (!usuarios) return res.status(500).send({ mensaje: 'Error en la consutla de Usuarios o no tiene datos' });
        return res.status(200).send({ usuarios });
        /* 
            {  
                "usuarios": ["el valor va a ser de lo que contenga la variable usuarios"]
            }
        */
    })
}

function obtenerUsuarioID(req, res) {
    var usuarioId = req.params.idUsuario;
    /* 
        Usuario.find({ _id: variable que contenga el id }, (err, usuarioEncontrado)=>{})
        Usuario.findOne({ _id: variable que contenga el id }, (err, usuarioEncontrado)=>{})
    */

    Usuario.findById(usuarioId, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ usuarioEncontrado });
    })
}

function login(req, res) {
    var params = req.body;
    /* 
        Usuario.find() <--- Me devuelve un array de objetos []
        Usuario.findOne() <----- Me devuelve un objeto {}
    */
    Usuario.findOne({ email: params.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'El usuario no se a podido identificar' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
        }
    })
}

function editarUsuario(req, res) {
    var idUsuario = req.params.id;
    var params = req.body;

    // BORRAR LA PROPIEDAD DE PASSWORD EN EL BODY 
    delete params.password;

    if (idUsuario != req.user.sub) {
        return res.status(500).send({ mensaje: 'No posee los permisos para editar ese usuario' });
    }
    
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

        return res.status(200).send({ usuarioActualizado })
    })
  
}

function editarUsuarioAdmin(req, res) {
    var idUsuario = req.params.id;
    var params = req.body;

    // BORRAR LA PROPIEDAD DE PASSWORD EN EL BODY 
    delete params.password;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'Solo el administrador puede editar usuarios.'})
    }
    
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

        return res.status(200).send({ usuarioActualizado })
    })
  
}

function eliminarUsuarioAdmin(req, res) {
    var idUsuario = req.params.idUsuario;

    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: 'Solo el administrador puede eliminar al Usuario' });
    }

    Usuario.findByIdAndDelete(idUsuario, ((err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar usuario' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Usuario'});

        return res.status(200).send({ usuarioEliminado })
    }))
}

function eliminarArchivo(res, rutaArchivo, mensaje) {
    fs.unlink(rutaArchivo, (err)=>{
        return res.status(500).send({ mensaje: mensaje})
    })
}

function subirImagenUsuario(req, res) {
    var idUsuario = req.user.sub;

    if (req.files) {
        var direccionArchivo = req.files.imagen.path;
        console.log(direccionArchivo);

        // documentos/imagenes/foto_perfil.png  →  ['documentos', 'imagenes', 'foto_perfil.png']
        // Hola Mundo  →  ['Hola', 'Mundo']
        var direccion_split = direccionArchivo.split('\\')
        console.log(direccion_split);

        // src\imagenes\usuarios\nombre_imagen.png ← Nombre Archivo
        var nombre_archivo = direccion_split[3];
        console.log(nombre_archivo);

        var extension_archivo = nombre_archivo.split('.');
        console.log(extension_archivo);

        var nombre_extension = extension_archivo[1].toLowerCase();
        console.log(nombre_extension);

        if(nombre_extension === 'png' || nombre_extension === 'jpg' || nombre_extension === 'gif'){
            Usuario.findByIdAndUpdate(idUsuario, { imagen:  nombre_archivo}, {new: true} ,(err, usuarioEncontrado)=>{
                return res.status(200).send({usuarioEncontrado});
            })
        }else{
            return eliminarArchivo(res, direccionArchivo, 'Extension, no permitida');
        }
    }
}

function obtenerImagen(req, res) {
    var nombreImagen = req.params.imagen;
    var rutaArchivo = `./src/imagenes/usuarios/${nombreImagen}`;

    fs.access(rutaArchivo, (err)=>{
        if (err) {
            return res.status(500).send({ mensaje: 'No existe la imagen' });
        }else{
            return res.sendFile(path.resolve(rutaArchivo));
        }
    })
}

module.exports = {
    ejemplo,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editarUsuario,
    editarUsuarioAdmin,
    eliminarUsuarioAdmin,
    subirImagenUsuario,
    obtenerImagen
}