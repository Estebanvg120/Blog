const validator = require('validator');

const validarArticulo = (datos) =>{
  let validation_titulo = !validator.isEmpty(datos.titulo) && validator.isLength(datos.titulo, {min:0, max:20});
  let validation_contenido = !validator.isEmpty(datos.contenido);

  if(!validation_titulo || !validation_contenido){
    throw new Error('No se ha validado la informacion');
  }
}

module.exports = {
  validarArticulo,
};