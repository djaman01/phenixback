//using the Express.js framework to create a simple HTTP server that interacts with a MongoDB database through Mongoose. 

//Importing Dependencies:
const express = require('express') //It imports the Express.js library for building web applications.
const app = express() //It creates an Express application instance called app
const port = 3005 //It sets the port variable to 3005, which is the port number on which the server will listen.
const db = require('./connect-db')
const postModel = require('./model-doc')
//npm i cors
const cors = require('cors')
app.use(cors())
//It requires two modules: db and model-doc. These likely contain code for establishing a connection to the MongoDB database and defining a Mongoose model, respectively.

//Middleware Configuration:
//This line configures the Express application to parse incoming JSON data from requests. This is necessary for processing JSON data sent in HTTP requests.
app.use(express.json());

//Defining a Route for the Root URL ("/"):
//This code defines an HTTP GET route for the root URL ("/"). When a client accesses this URL, it sends a simple "Hello World!" message as a response.
app.get('/', (req, res) => {
  res.send('Hello World!')  
})

//Handling POST Requests to the Root URL ("/") after http://localhost:3005 S'il n'y a rien après 3005 (port qu'on a décidé plus haut) on met "/" 
app.post('/', async(req, res) =>{
  const {Nom, Prenom} = req.body //It extracts the "Nom" and "Prenom" from the request body using destructuring assignment.
  try{
      const newPost = await postModel.create({Nom, Prenom}); //It attempts to create a new document (record) in the MongoDB collection using the postModel.create() method. 
      res.json(newPost)//If the document is successfully created, it responds with the newly created document in JSON format.
  }catch(error){
      res.status(500).send(error)
    }
    //If an error occurs during the creation process, it responds with a 500 (Internal Server Error) status code and sends the error message.
})
//This code defines an HTTP POST route for the root URL ("/"). When a client sends a POST request to this URL, it expects a JSON object with "Nom" and "Prenom" properties in the request body.

//Starting the Server:
//This code starts the Express server and listens on the specified port (3005 in this case). When the server starts, it prints a message to the console indicating that it's listening on the specified port.
app.listen(port, () => {
  console.log(`Example app listening ${port}`)
})

// !!!!! Run: npx nodemon server.js to run the server automatically when we make a change
//!!!!!!!!!!!!!!! Il faut toujours allumer le server avec npx nodemon server.js pour lancer le backend

//In summary, this code sets up an Express.js server that listens on port 3005, provides a simple "Hello World!" message when accessing the root URL with a GET request, and allows the creation of new documents in a MongoDB collection when sending a POST request to the same root URL with JSON data.