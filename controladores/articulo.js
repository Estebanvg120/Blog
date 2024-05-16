//Importaciones
const { validarArticulo } = require('../helpers/validar');
const path = require("path");
const fs = require("fs");
const Articulo = require('../modelos/Articulo');


// Controladores utiles para el Blog

const createArticle = (req, res) => {
  // Recoger parametros por post para guardar
  let parametros = req.body;

  //Validar datos 
  try {
    validarArticulo(parametros); //
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "_Faltan datos por enviar"
    });
  }

  //Crear el objeto a guardar y asignar de manera automatica
  const articulo = new Articulo(parametros);
  //Crear el objeto a guardar y asignar de manera manual
  //articulo.titulo = parametros.titulo

  //Guardar articulo en la Base de datos

  articulo.save().then(doc => {
    if (doc.errors) {
      return res.status(400).json({
        success: false,
        message: "_No se pudo guardar el articulo"
      });
    }
    return res.status(200).json({
      success: true,
      message: 'La acción se ejecutó correctamente',
      doc
    });
  });
}

const listarArticulos = (req, res) => {

  let articulos = Articulo.find({});
  if (req.params.limit) {
    const limit = parseInt(req.params.limit);
    articulos.limit(limit);
  }
  articulos.sort({ fecha: -1 }).exec().then(doc => {
    if (doc.errors) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron articulos'
      });
    }

    return res.status(200).json({
      success: true,
      limit: doc.length,
      data: doc
    });
  });
};

const articuloById = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await Articulo.findById(id).exec();
    return res.status(200).json({
      success: true,
      data: doc
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'No se encontraron datos',
      error
    });
  }
};

const deleteArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Articulo.findById(id).exec();
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      })
    }
    await Articulo.findOneAndDelete(id).exec();
    return res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error
    });
  }
};

const updateArticle = async (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  // Validar Datos
  try {
    validarArticulo(datos);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "_Faltan datos por enviar"
    });
  }

  try {
    const updatearticle = await Articulo.findOneAndUpdate({ _id: id }, datos, { new: true }).exec();
    return res.status(200).json({
      success: true,
      data: updatearticle
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error,
    });
  }
};
const subirArchivos = async (req, res) => {
  const id = req.params.id;
  // Configurar el multer

  //Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      success: false,
      message: 'Peticion invalida'
    });
  }
  // Nombre del archivo
  let nombrearchivo = req.file.originalname;
  //Extension del archivo 
  let extensionarchivo = nombrearchivo.substring(nombrearchivo.lastIndexOf(".") + 1);
  // Comprobar extension del archivo correcto
  if (extensionarchivo != "png"
    && extensionarchivo != "jpg"
    && extensionarchivo != "jpeg"
    && extensionarchivo != "gif") {
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (err) => {
      return res.status(400).json({
        success: false,
        message: "Archivo invalido"
      });
    })
  } else {
    // Si todo va bien, actualizar el articulo
    const updatearticle = await Articulo.findOneAndUpdate({ _id: id }, {imagen: req.file.filename}, { new: true }).exec();
    // Devolver respuesta
    return res.status(200).json({
      success: true,
      data: updatearticle,
      fichero: req.file
    });
  }
}

const getImagen = (req, res) => {
  const fichero = req.params.fichero;
  const ruta = './imagenes/articulos/' + fichero;

  fs.stat(ruta, (err, exist) => {
    if (exist) {
      return res.sendFile(path.resolve(ruta));
    }else{
      return res.status(404).json({
        success: false,
        message: 'No se encontró imagen',
        err
      })
    }
  });
}

const buscador = async (req, res) => {
  // Obtener String de busqueda
  const data = req.params.data;
  // Find OR
 const busqueda = await Articulo.find({"$or": 
    [
      {"titulo" : {"$regex": data, "$options": "i"}},
      {"contenido" : {"$regex": data, "$options": "i"}}
    ]
  })
  // Orden
  .sort({fecha: -1})
  // Ejcutar consulta
  .exec()
  // Devolver respuesta
  if (!busqueda || busqueda.length === 0) {
    return res.status(404).json({
      success: false, 
      message: "No se encontró coincidencias con la busqueda"
    })
  }else{
    return res.status(200).json({
      success: true, 
      busqueda
    })
  }
}

module.exports = {
  createArticle,
  listarArticulos,
  articuloById,
  deleteArticle,
  updateArticle,
  subirArchivos,
  getImagen,
  buscador
};