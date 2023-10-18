//Define schemas and models for a MongoDB database
const mongoose = require("mongoose");

//Defining a schema = Structure of documents (data) that will be stored in a MongoDB collection named "Contact."
const contact = mongoose.Schema (
  {
    Nom: "String",
    Prenom: "String",
    Ville: "String",
    Mail: "String",
    Telephone: "String",
    Aide: "String",
    News: "String"
  },
  //Adds "createdAt" and "updatedAt" fields for document creation and modification timestamps.
  {
    timestamps: true,
  }
);

//On va maintenant CREE ce modele dont on a fait la structure précedemment, dans une nouvelle collection qu'on crée ici ex: ContactPhenix
//mongoose.model('nomCollection', variableName qui store la structure) et on le store dans la variable post
const post = mongoose.model("contactPhenix", contact);

//

const products = mongoose.Schema (
  {
      type: "string",
      nom: "String",
      imageUrl: "String",
      dimensions: "String",
      matiere: "String",
      prix: "String",
      code: "String"
  },
  //Adds "createdAt" and "updatedAt" fields for document creation and modification timestamps.
  {
    timestamps: true,
  }
);

//On va maintenant CREE ce modele dont on a fait la structure précedemment, dans une nouvelle collection qu'on crée ici ex: ContactPhenix
//mongoose.model('nomCollection', variableName qui store la structure) et on le store dans la variable post
const postProducts = mongoose.model("productsPhenix", products);


module.exports = {post, postProducts};
//This code exports the contact schema stored dans la variable post
// It means that other parts of your application will have access to the schema definition,
