const { response } = require('express');
const Usuario = require('../models/usuario');
const Project = require('../models/project');
const Categoria = require('../models/categoria');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const typeFilter = req.query.type || null;
    const regex = new RegExp(busqueda, 'i');

    // Build project query filter
    let projectFilter = { name: regex };
    if (typeFilter) {
        projectFilter.type = typeFilter;
    }

    // First, find categories that match the search
    const categorias = await Categoria.find({ nombre: regex });
    const categoriaIds = categorias.map(cat => cat._id);

    // Then, find projects that match either name or category in the list
    const projectsFilter = {
        $or: [
            { name: regex },
            { category: { $in: categoriaIds } }
        ]
    };
    if (typeFilter) {
        projectsFilter.type = typeFilter;
    }

    const [usuarios, projects, categoria] = await Promise.all([
        Usuario.find({ username: regex }),
        Project.find(projectsFilter).populate('category', 'nombre'),
        Categoria.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        projects,
        categoria
    });
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const typeFilter = req.query.type || null;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ username: regex });
            break;
        case 'categorias':
            data = await Categoria.find({ nombre: regex });
            break;
        case 'projects':
            // First, find categories that match the search
            const categorias = await Categoria.find({ nombre: regex });
            const categoriaIds = categorias.map(cat => cat._id);

            // Then, find projects that match either name or category in the list
            let projectsFilter = {
                $or: [
                    { name: regex },
                    { category: { $in: categoriaIds } }
                ]
            };
            if (typeFilter) {
                projectsFilter.type = typeFilter;
            }
            data = await Project.find(projectsFilter).populate('category', 'nombre');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser usuarios/categorias/projects'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}

