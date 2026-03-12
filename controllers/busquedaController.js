const { response } = require('express');
const Usuario = require('../models/usuario');
const Project = require('../models/project');
const Categoria = require('../models/categoria');
const Pais = require('../models/pais');

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

    // Find matching pais
    const matchingPaises = await Pais.find({ pais: regex });
    const paisIds = matchingPaises.map(p => p._id);

    // Then, find projects that match either name or category or pais in the list
    const projectsFilter = {
        $or: [
            { name: regex },
            { ubicacion: regex },
            { tipoMenu: regex },
            { category: { $in: categoriaIds } },
            { pais: { $in: paisIds } }
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
    const searchPaises = Pais.find({ pais: regex });

    res.json({
        ok: true,
        usuarios,
        projects,
        categoria,
        paises: await searchPaises
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

            // Find matching pais
            const matchingPaises = await Pais.find({ pais: regex });
            const paisIds = matchingPaises.map(p => p._id);

            // Then, find projects that match either name or category or pais
            let projectsFilter = {
                $or: [
                    { name: regex },
                    { ubicacion: regex },
                    { tipoMenu: regex },
                    { category: { $in: categoriaIds } },
                    { pais: { $in: paisIds } }
                ]
            };
            if (typeFilter) {
                projectsFilter.type = typeFilter;
            }
            data = await Project.find(projectsFilter).populate('category', 'nombre');
            break;
        case 'pais':
            data = await Pais.find({ pais: regex });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser usuarios/categorias/projects/pais'
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

