//Define schemas and models for a MongoDB database
const mongoose = require("mongoose");

//1) Création modèle pour store data qui vient du form de Contact

//a) Defining a schema = structure du document et on le store dans une variable qu'on a appelé contact
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

//On va maintenant store le modele fans "contact" crée précédemment, dans la variable "post" + Quand on va le crée dans la database, on veut que la collection qui store le form de contact s'appelle "contactPhenix"
//mongoose.model('nomCollection qu'on veut crée', variableName qui store la structure)
const postContact = mongoose.model("contactPhenix", contact);

//----------------------------------------

//2) Création modèle pour store data qui vient du form de l'ajout produit par l'admin

const products = mongoose.Schema (
  {
    nom: "String",
    dimensions: "String",
    matiere: "String",
    prix: "String",
    code: "String",
    thumbnail: "String"
   
  },

  {
    timestamps: true,
  }
);


const postProducts = mongoose.model("productsPhenix", products);


module.exports = {postContact, postProducts};
//This code exports the contact schema stored dans la variable post
// It means that other parts of your application will have access to the schema definition,
