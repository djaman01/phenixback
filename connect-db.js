const mongoose = require("mongoose");

// Required fields for a successful connection
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = `mongodb+srv://jaafar:jaafar@cluster0.ff2excr.mongodb.net/?retryWrites=true&w=majority`

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


