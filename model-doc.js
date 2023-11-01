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

const products = mongoose.Schema(
  {
    type: "string",
    nom: "string",
    imageUrl: "string",
    dimensions: "string",
    matiere: "string",
    prix: "string",
    code: "string"
  },

  {
    timestamps: true,
  }
);
//mongoose.model("collectionName", schema)
const postProducts = mongoose.model('allProduct', products)

//

const login = mongoose.Schema({
  user: {
    type: String,
    default: "Jaafar" // Set my default username here, so no need to post 'cause i'm the only admin
  },
  password: {
    type: String,
    default: "Mot2pass1" // Set my default password here, so no need to post 'cause i'm the only admin
  }
});

const saveLogin = mongoose.model("log", login);


//Modèle for newlogin

const userSchema = mongoose.Schema({
    name: "String",
    email: "String",
    password: "String",
    role: {
      type: String,
      default: "visitor"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = {post, postProducts, saveLogin, userModel};
//This code exports the contact schema stored dans la variable post
// It means that other parts of your application will have access to the schema definition,

