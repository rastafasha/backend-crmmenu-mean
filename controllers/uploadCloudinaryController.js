const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { actualizarImagenCloudinary } = require('../helpers/actualizar-imagen-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage });

// configurar cloudinary
cloudinary.config({
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
    cloud_name: process.env.CLOUD_NAME
});

const fileUpload = async (req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = [
        'profiles', 
        'projects', 
    ];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo permitido (tipo)'
        });
    }

    // validar que exista un archivo
    console.log(req.body); // Log the incoming request body
    if (!req.file || !req.body.tipo || !req.body.id) {
        return res.status(400).json({
            ok: false,
            msn: 'No hay ningun archivo'
        });
    }
    
    // procesar la imagen
    const file = req.file; // Access the uploaded file correctly
    console.log('Uploaded file:', file); // Log the uploaded file
    
    const nombreCortado = file.originalname.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'pdf'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msn: 'No es una extension permitida'
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    console.log('File path for upload:', file); // Log the file path
    try {
        const stream = cloudinary.uploader.upload_stream({
            folder: `articlesApp/uploads/${tipo}/`,
            resource_type: 'auto' // Automatically detect the resource type
        }, (error, result) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al subir la imagen a Cloudinary',
                    error: error
                });
            }
            // Update the database with the Cloudinary URL
            const urlArchivo = result.secure_url;
            actualizarImagenCloudinary(tipo, id, urlArchivo);

            res.json({
                ok: true,
                msg: 'Archivo subido',
                urlArchivo
            });
        });

        // Pass the file buffer to the upload stream
        stream.end(file.buffer);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al subir la imagen a Cloudinary',
            error: error
        });
    }
};

const retornaImagen = (req, res) => {
    const foto = req.params.foto;

    // Retrieve the image directly from Cloudinary
    const urlImg = cloudinary.url(foto, {
        width: 300,
        height: 300,
        crop: 'fill'
    });
    res.redirect(urlImg);
};

module.exports = {
    fileUpload,
    retornaImagen
};
