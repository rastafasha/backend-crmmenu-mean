/*
 Ruta: /api/projects
 */

const { Router } = require('express');
const router = Router();
const {
    createProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    getProjectsByUser,
    updateStatus,
    listarProyectPorCategoria
} = require('../controllers/projectController.js');

const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


router.get('/',  
    validarJWT, 
    getProjects);
router.get('/user/:id',   getProjectsByUser);
router.get('/category/:nombre',   listarProyectPorCategoria);

router.get('/:id',  
    validarJWT,
     getProject);

router.post('/store',  
    validarJWT, 
     createProject 
    );
router.delete('/delete/:id',  validarJWT, deleteProject);
router.put('/update/:id',  validarJWT, updateProject);
router.put('/updatestatus/:id',  validarJWT, updateStatus);


module.exports = router;