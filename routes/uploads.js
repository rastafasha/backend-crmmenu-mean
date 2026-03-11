/*
Ruta: /api/uploads/
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const { fileUpload, retornaImagen } = require('../controllers/uploadCloudinaryController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/temp'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

router.put('/:tipo/:id', validarJWT, upload.single('imagen'), fileUpload);
router.get('/:tipo/:foto', retornaImagen);

module.exports = router;
