const mongoose = require("mongoose");

// Required fields for a successful connection
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//jaafar = user  2eme jaafar = mdp base de donnée et non site phenixData= non dataBase ou va s'envoyer les documents
const uri = `mongodb+srv://jaafar:jaafar@cluster0.ff2excr.mongodb.net/phenixData?retryWrites=true&w=majority`

// Connect to MongoDB
const connexion = mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("Connected to MongoDB");  
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

module.exports = connexion;


