//using the Express.js framework to create a simple HTTP server that interacts with a MongoDB database through Mongoose. 

//Importing Dependencies:
const express = require('express') //It imports the Express.js library for building web applications.

const port = 3005 //app.listen(port, ...) sets up the server to listen on that port. 
const db = require('./connect-db')
const { post, postProducts, saveLogin, userModel } = require('./model-doc')//on destructure les differnts models
const multer = require('multer')
const path = require('path')
const cors = require('cors')

const fs = require('fs');


//Imports for the login page
const bcrypt = require('bcrypt') //pour pouvoir utiliser le framework bcrypt, et chiffrer les motdepasse entrés par les users
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express() //It creates an Express application instance called app, to easily create API

app.use(express.json());//To convert=parse incoming JSON data from HTTP requests, to Json Objects easier to read for the server

//Objectif: 1) Store le token dans le cookie en front-end side (on l'active grace à une ligne de code dans le component login.js)
app.use(
  cors({
    origin: ['https://phenixdeals.onrender.com'], // Local Host: to access the front-end side through this URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'], // Add any additional headers if needed
    credentials: true,
  })
);

//To access API inside our front-end
//2eme partie pour store cookie: res.cookie dans app.post('/register')

app.use(cookieParser());

//------------------------------------------------------

//Code pour ajouter plusieurs file en 1 fois lorsqu'on active le serveur: A commenter une fois tous les files envoyés

// const jsonData = fs.readFileSync('all-data.json', 'utf8');
// const alldata = JSON.parse(jsonData);

// //Insert data into the database
// postProducts.insertMany(alldata)
//   .then(function (models) {
//     console.log(models);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

//-------------------------------------------------------


const nodemailer = require('nodemailer'); //Pour envoyer le form au mail
const { verify } = require('crypto')


const transporter = nodemailer.createTransport({ //Utilisation nodemailer
  service: "gmail",
  auth: {
    user: "phenix.deals@gmail.com",
    pass: "ujgl seou tbpd bgpi"
  }
})


//This code defines an HTTP GET route for the root URL ("/"). When a client accesses this URL, it sends a simple "Hello World!" message as a response.
app.get('/', (req, res) => {
  res.send('Hello World!')
})


//Handling POST Request received by the server from the contact form in the browser, to send it's data to the MongoDb database and to my e-mail
app.post('/contact', async (req, res) => {
  const { Nom, Prenom, Ville, Mail, Telephone, Aide, News } = req.body //On DESTRUCTURE les property des objets pour y assigner les values et y accéder facilement

  const mailOptions = { //On veut aussi envoyer le tout à phenix.deals@gmail.com
    from: "phenix.deals@gmail.com",
    to: "phenix.deals@gmail.com",
    subject: "Contact Form phenixdeals.com",
    text: `Nom: ${Nom} \n Prenom: ${Prenom}\n Ville: ${Ville}\n Mail: ${Mail}\n Telephone: ${Telephone}\n Aide: ${Aide}`
  }
  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("mail sent:" + info.response)
      }
    });
    const newPost = await post.create({ Nom, Prenom, Ville, Mail, Telephone, Aide, News }); //It attempts to create a new document (record) in the MongoDB collection using the postModel.create() method. 
    res.json(newPost)//If the document is successfully created, it responds with the newly created document in JSON format.
  }
  catch (error) {
    res.status(500).send(error)
  }

})

//Pour stocker les fichier images send par le front-end, dans le serveur
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); //Pour gérer les fichier télécharégs dans les routes express


//Handling POST Request received by the server from the addProduct form in the browser, to send it's data (image+infos) to the MongoDb database
//upload.multiple pour stocker plusieurs images
app.post('/upload', upload.single('file'), async (req, res) => {
  try {

    const imageUrl = req.file.path.replace(/\\/g, '/'); // Pour accéder au path de l'image envoyer et store dans database

    const { type, auteur, infoProduit, etat, prix, code } = req.body; //Destructuring so name data property = value

    const newProduct = await postProducts.create({ type, auteur, infoProduit, etat, prix, code, imageUrl })
    res.json({ newProduct }) //Facultatif: Si document est bien crée, l'envoie à la console du browser en format json
  }
  catch (error) {
    console.error('Error handling image upload and product data storage:', error);
    res.status(500).json({ error: error.message });
  }
});

//1er login 
app.get("/log", async (req, res) => {
  try {
    const { user, password } = req.body;
    // Create a new login document using the saveLogin model
    const newLogin = new saveLogin({
      user,
      password,
    })

    // Save the new login document to the database
    const savedLogin = await newLogin.save();

    res.status(201).json(savedLogin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating login entry" });
  }
});

//API = Route handler for LOGIN Registration

app.post('/register', (req, res) => {
  const { email, password } = req.body;//On récupère les states variables crées à partir du browser pour pouvoir les utiliser
  bcrypt.hash(password, 10)//Pour Cacher les values contenu dans password // 10 = facteur de cout qui va hash plsr fois le password pr sécurité
    .then(hash => {
      userModel.create({ email, password: hash }) //password va etre caché
        .then(user => res.json("Success"))
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

// API= Router login page et création token

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email })
    .then(user => { //Si email est trouvé, vérifie le password
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          //Si response= password bon = genere 1 token avec module stored dans variable jwt / Si password mauvais répondre par 'The password is incorrect"
          if (response) {
            const token = jwt.sign({ email: user.email, role: user.role }, "jwt-secret-key", { expiresIn: "1d" })//sign(payload: JSON qui contient infos à transmettre /Secret key: doit avoir au moins 32 characteres / jours avant expiration: facultatif)
            res.cookie('token', token)//Pour store le token dans le cookie res.cookie('nameOfToken', value)
            return res.json({ Status: "Success", role: user.role })//Montre dans la console status:success et role: admin si admin connecté
          }
          else { //si password faux, répond:
            return res.json("Password incorrect")
          }
        })
      }
      else {
        return res.json("email not found")
      }
    })
})

//middleware to verify the token et crée une protected route pour accéder au Dashboard = plus de sécurité avant la réponse

const verifyUser = (req, res, next) => {
  const token = req.cookies.token; //c'est le token qu'on a stocké dans le cookie
  if (!token) { //si on ne trouve pas de token
    return res.json("Token is missing")
  }
  else { //si le token est présent, on vérifie s'il est Bon/validé ou pas
    jwt.verify(token, 'jwt-secret-key', (err, decoded) => { //decoded = value de jwt.sign qui constitue les données du token (ici c'est email and role)
      if (err) {
        return res.json("Error with token")
      }
      else { //Si pas d'erreur avec le token
        if (decoded.role === "admin") {
          next() //Active la middleware et autorise la poursuite de la requete pour avoir une réponse
        }
        else {
          return res.json("not admin")
        }
      }
    })
  }
}

//2 Protected Routes pour accéder aux pages avec routes /dashboard et /addProduct 
//Ne s'ouvre que si loggedIn avec role = Admin et donc = 1 token stocké dans cookies (régler pour s'expirer après 1j de connexion)

app.get('/dashboard', verifyUser, (req, res) => {
  res.status(200).json({ message: 'Success' });
})

app.get('/addProduct', verifyUser, (req, res) => {
  res.status(200).json({ message: 'Success' });
})

//Creating the LOGOUT API

app.get('/logout', (req, res) => {
  res.clearCookie('token'); //Car j'ai appelé mon token 'token' précédemment
  return res.json({ status: "Success" })// Return the message "success" if the token is cleared / Permettra de faire la if condition dans le front pour reload the page when logged out
})

//Route Handler to GET all products que j'utilise dans la catégorie Achat et aussi pour display les added products
app.get('/products', async (req, res) => {
  try {
    const products = await postProducts.find(); // postProducts est mon model, postProducts.find()= ramène tout l'object postProducts

    // j'envoie une liste de produit en json comme réponse à la requete GET
    res.json(products);
  } catch (error) {
    console.error('Error fetching products from the database:', error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});

//Route Handler to GET only the products with type:"Bijoux"
app.get('/bijou', async (req, res) => {
  try {
    // Use Mongoose to query for "bijoux" products
    const bijouxProducts = await postProducts.find({ type: 'Bijou' });//postProducts.find({ type: 'Bijoux' })= ramène que les objets de postProducts model, avec type:"bijoux"

    // Return the matching products as a JSON response
    res.json(bijouxProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//API: Route Handler to GET only the products with type:"Tableau"
app.get('/tableau', async (req, res) => {
  try {
    // Use Mongoose to query for "tableau" products
    const tableauProducts = await postProducts.find({ type: 'Tableau' });//postProducts.find({ type: 'Tableau' })= ramène que les objets de postProducts model, avec type:"Tableau"

    // Return the matching products as a JSON response
    res.json(tableauProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Route Handler to GET only the products with type:"Decoration"
app.get('/decoration', async (req, res) => {
  try {
    // Use Mongoose to query for "bijoux" products
    const decoProducts = await postProducts.find({ type: 'Décoration' });//postProducts.find({ type: 'Bijoux' })= ramène que les objets de postProducts model, avec type:"bijoux"

    // Return the matching products as a JSON response
    res.json(decoProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Route Handler to GET only the products with type:"Decoration"
app.get('/livre', async (req, res) => {
  try {
    // Use Mongoose to query for "bijoux" products
    const livreProducts = await postProducts.find({ type: 'Livre' });//postProducts.find({ type: 'Bijoux' })= ramène que les objets de postProducts model, avec type:"bijoux"

    // Return the matching products as a JSON response
    res.json(livreProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Route Handler to GET only 1 product info when clicked so with: _id because it's unique
app.get('/article/:productId', async (req, res) => {
  try {
    const productId = req.params.productId; //on sort le parametre productId et on le store dans une variable pour pouvoir l'utiliser, car = row._id et donc identifie le produit
    const product = await postProducts.findById(productId); //On utilise la methode .findById() pour trouver 1 produit avec cette id qu'on a récupérer

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



//Handles the Put Request
app.put('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId; // Get the product ID from the URL parameter 
    const updatedProductData = req.body; // Get the updateProductData state variable values from the body = prix and code values

    // Here we update the document in the MongoDB database using the findByIdAndUpdate() Mongoose method
    //productId= Find the specific document we want to update / updateProducteData= la new data ecrite dans le browser / { new: true }: tells Mongoose to return the UPDATED document after the update operation.
    const updatedProduct = await postProducts.findByIdAndUpdate(productId, updatedProductData, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct); //Si mis à jour réussie: renvoie le produit mis à jour en tant que réponse
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Handles the DELETE Request
app.delete('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await postProducts.findByIdAndRemove(productId); //Là ça supprime le produit de la base de donnée PUIS passe à la suite (await)

    if (deletedProduct) {
      res.json({ message: 'Product deleted successfully', deletedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Route Handler to GET the last 20 products
app.get('/lastproducts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20; // Get the 'limit' query parameter from the request or default to 20
    const products = await postProducts.find().sort({ _id: -1 }).limit(limit); // Sort by _id in descending order to get the last 20 products

    res.json(products);
  } catch (error) {
    console.error('Error fetching products from the database:', error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});

// Route Handler to GET related products by product name / response.data.nom = :productname
app.get('/related-products/:productName', async (req, res) => {
  try {
    const productName = req.params.productName; //On capte le product name et on le store dans uen variable
    const relatedProducts = await postProducts.find({ auteur: productName }); //On find ce productname

    if (relatedProducts) {
      res.json(relatedProducts);
    } else {
      res.status(404).json({ error: 'Related products not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Starting the Server:
//This code starts the Express server and listens on the specified port (3005 in this case). 
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

