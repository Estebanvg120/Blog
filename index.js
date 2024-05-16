//importar conexion a la base de datos
const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');
//inicializar aplicacion
console.log("Hola, se inicio la Aplicacion correctamente");
//Conectar a la base de datos
connection();
//Crear servidor con Node
const app = express();
const puerto = 3900;
//Configurar cors
app.use(cors());
//Convertir body a objeto js
app.use(express.json()); //Esto es para recibir parametros con content-type app/json
app.use(express.urlencoded({ extended: true })); // form-urlencoded
//RUTAS
const articulo_rutas = require('./rutas/articulo');
//Cargo las rutas
app.use("/api", articulo_rutas);




//Crear servidor y escuchar peticiones http
app.listen(puerto, ()=> {
  console.log("Servidor corriendo en el puerto: " + puerto);
});