//The provided code is written in JavaScript and uses the Mongoose library to define a schema and model for a MongoDB database


const mongoose = require("mongoose");

//Here, you define a Mongoose schema using the mongoose.Schema method. This schema represents the structure of documents (data) that will be stored in a MongoDB collection named "Contact."
//En bref, on crée juste une structure = schema pour le document

const contact = mongoose.Schema (
  //Toujours mettre à jour l'api .post dans le file server.js
  {
    Nom: "String",
    Prenom: "String",
    Ville: "String",
    Mail: "String",
    Telephone: "String",
    Aide: "String",
    //Toggle: "Boolean"
  },
  //The timestamps option is included, which automatically adds "createdAt" and "updatedAt" fields for document creation and modification timestamps.
  {
    timestamps: true,
  }
);

//On va maintenant CREE ce modele dont on a fait la structure précedemment, grace à mongoose.model('nomCollection', variableName qui store la structure) et on le store dans la variable post
const post = mongoose.model("contactPhenix", contact);

//La collection peut ne pas encore être crée sur mongoDB, elle se créera plus tard

module.exports = post;
//This code exports the contact schema stored dans la variable post
// It means that other parts of your application will have access to the schema definition,
