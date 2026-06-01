const fs = require('fs');
const Project = require('../models/project');

// 🛠️ SE AGREGA 'campoDestino' como parámetro opcional al final
const actualizarImagen = async (tipo, id, nombreArchivo, campoDestino = null) => {

    let pathViejo = '';

    switch (tipo) {

        case 'projects':
            const project = await Project.findById(id);
            if (!project) {
                console.log('No es un projects por id');
                return false;
            }
            pathViejo = `./uploads/projects/${project.img}`;
            borrarImagen(pathViejo);
            project.img = nombreArchivo;
            await project.save();
            return true;
            break;

            const transferencia = await Transferencia.findById(id);
            if (!transferencia) {
                console.log('No es un transferencia por id');
                return false;
            }
            if (transferencia.img) {
                pathViejo = `./uploads/transferencias/${transferencia.img}`; // Corregido typo de variable 'driver'
                borrarImagen(pathViejo);
            }
            transferencia.img = nombreArchivo;
            await transferencia.save();
            return true;
            break;
    }
};

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // borrar la imagen anterior si usas almacenamiento local
        fs.unlinkSync(path);
    }
}
module.exports = {
    actualizarImagen,
    borrarImagen
};
