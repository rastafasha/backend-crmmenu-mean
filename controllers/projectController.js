const { response } = require('express');
const Project = require('../models/project');

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .populate('category')
            .populate('pais')
        // .populate('ProjectType');
        //traemos las tareas en orden de ultima fecha
        projects.sort((a, b) => b.createdAt - a.createdAt);


        res.json({
            ok: true,
            projects
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener proyectos' });
    }
};

const getProjectsByUser = async (req, res) => {
    const uid = req.uid;
    try {
        const projects = await Project.find({
            partners: req.params.id
        })
        .populate('category')
        .populate('pais');
        res.json({
            ok: true,
            projects
        });
    } catch (error) {
        return res.status(404).json({ message: 'No projects found' });
    }
};

const createProject = async (req, res) => {
    const uid = req.uid;
    const name = req.body.name || '';
    
    try {
       

        // 3. Instanciar y guardar en MongoDB Atlas
        const project = new Project({
            usuario: uid,
            ...req.body,
        });

        const projectDB = await project.save();

        res.json({
            ok: true,
            project: projectDB
        });

    } catch (error) {
        console.error(error); // Mantiene el rastro del error visible en la consola de Render
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
};


const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        .populate('category')
        .populate('pais')

        if (!project) return res.status(404).json({ msg: 'project not found' })
        res.json({
            ok: true,
            project
        });

    } catch (error) {
        return res.status(404).json({ msg: 'project not found' })
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id)
        if (!project) return res.status(404).json({ msg: 'project not found' })
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ msg: 'project not found' })
    }
};

const updateProject = async (req, res) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ // Cambiado a 404 (Not Found)
                ok: false,
                msg: 'project no encontrado por el id'
            });
        }

        const cambiosProject = {
            ...req.body,
            usuario: uid
        }

        const projectActualizado = await Project.findByIdAndUpdate(id, cambiosProject, { new: true });

        res.json({
            ok: true,
            projectActualizado
        });

    } catch (error) {
        console.log(error); // Es buena práctica imprimir el error en consola para debugging
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function updateStatus(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Project.findByIdAndUpdate({ _id: id }, { status: true }, (err, project_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (project_data) {
                res.status(200).send({ project: project_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el project, vuelva a intentar nuevamente.' });
            }
        }
    })
}

const listarProyectPorCategoria = async (req, res) => {
    var nombre = req.params['nombre'];
    try {
        // First, find the category by name
        const Categoria = require('../models/categoria');
        const categoria = await Categoria.findOne({ nombre: nombre });
        
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        // Then, find projects using the category's ObjectId
        const projects = await Project.find({ category: categoria._id })
            .populate('category')
            .populate('pais');
        
        res.status(200).send({ projects: projects });
    } catch (err) {
        res.status(500).send({ error: err });
    }
}


module.exports = {
    getProjects,
    getProjectsByUser,
    createProject,
    getProject,
    deleteProject,
    updateProject,
    updateStatus,
    listarProyectPorCategoria


};