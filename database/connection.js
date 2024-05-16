const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mi_blog');
    // await mongoose.connect('mongodb://monguito:27017/mi_blog');

    //pasar por parametros en un objeto solo si arroja error
    //useNewUrlParser: true
    //useUnifiedTopology: true
    //useCreateIndex: true
    console.log("Connection succeeded Mi Blog");
  } catch (error) {
    console.log(error);
    throw new Error('Error connecting to DataBase');
  }
}
module.exports = {
  connection
}