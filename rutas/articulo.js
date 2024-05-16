const express = require('express');
const multer = require("multer");
const router = express.Router();
const ArticuloControlador = require('../controladores/articulo');

// Configuracion de almacenamiento multer
const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imagenes/articulos/')
  },
  filename: function (req, file, cb) {
    cb(null, 'articulo' + Date.now() + '-' + file.originalname)
  }
});
const subiendoarchivo = multer({storage: almacenamiento});

// Rutas
router.post('/createArticle', ArticuloControlador.createArticle);
router.get('/getArticles/:limit?', ArticuloControlador.listarArticulos);
router.get('/getArticleById/:id', ArticuloControlador.articuloById);
router.delete('/deleteArticle/:id', ArticuloControlador.deleteArticle);
router.put('/updateArticle/:id', ArticuloControlador.updateArticle);
router.post('/subir-archivos/:id', [subiendoarchivo.single('file0')], ArticuloControlador.subirArchivos);
router.get('/getImagenByName/:fichero', ArticuloControlador.getImagen);
router.get('/buscar/:data', ArticuloControlador.buscador);

module.exports = router;