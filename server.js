//using the Express.js framework to create a simple HTTP server that interacts with a MongoDB database through Mongoose. 

//Importing Dependencies:
const express = require('express') //It imports the Express.js library for building web applications.
const app = express() //It creates an Express application instance called app
const port = 3005 //It sets the port variable to 3005, which is the port number on which the server will listen.
const db = require('./connect-db')
const { post, postProducts } = require('./model-doc')//on destructure les differnts models
//npm i cors
const multer = require('multer')
const path = require('path')
const cors = require('cors')
app.use(cors())

const nodemailer = require('nodemailer'); //Pour envoyer le form au mail

const transporter = nodemailer.createTransport({ //Utilisation nodemailer
  service: "gmail",
  auth: {
    user: "phenix.deals@gmail.com",
    pass: "ujgl seou tbpd bgpi"
  }
})

//This line configures the Express application to parse incoming JSON data from requests. This is necessary for processing JSON data sent in HTTP requests.
app.use(express.json());

//This code defines an HTTP GET route for the root URL ("/"). When a client accesses this URL, it sends a simple "Hello World!" message as a response.
app.get('/', (req, res) => {
  res.send('Hello World!')
})


//Handling POST Request received by the server from the contact form in the browser, to send it's data to the MongoDb database and to my e-mail
app.post('/', async (req, res) => {
  const { Nom, Prenom, Ville, Mail, Telephone, Aide, News } = req.body //On veut envoyer Nom, Prenom...etc à mongoDB

  const mailOptions = { //On veut aussi envoyer le tout à phenix.deals@gmail.com
    from: "phenix.deals@gmail.com",
    to: "phenix.deals@gmail.com",
    subject: "Contact Form phenixdeals.com",
    text: `Nom: ${Nom} \n Prenom: ${Prenom}\n Ville: ${Ville}\n Mail: ${Mail}\n Telephone: ${Telephone}\n Aide: ${Aide}\n News: ${Prenom}`
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
  } catch (error) {
    res.status(500).send(error)
  }

})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


//Handling POST Request received by the server from the addProduct form in the browser, to send it's data (image+infos) to the MongoDb database
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Access the uploaded file path
    const imageUrl = req.file.path.replace(/\\/g, '/');

    // Extract product data by destructuring the object from the request body
    const { type, nom, dimensions, matiere, prix, code } = req.body;

    // Create a new product using the Mongoose model and include the image URL
    const newProduct = new postProducts({
      type,
      nom,
      imageUrl, // Include the image URL
      dimensions,
      matiere,
      prix,
      code,
    });

    // Save the product to the database
    await newProduct.save();
    // Respond with a success message or the newly created product
    // res.json({ message: 'Image uploaded and product data stored successfully', product: newProduct });
    res.json({ imageUrl })
  } catch (error) {
    console.error('Error handling image upload and product data storage:', error);
    res.status(500).json({ error: 'Unable to upload image and store product data' });
  }
});


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


//Route Handler to GET only the products with type:"Tableau"
app.get('/tableau', async (req, res) => {
  try {
    // Use Mongoose to query for "bijoux" products
    const tableauProducts = await postProducts.find({ type: 'Tableau' });//postProducts.find({ type: 'Bijoux' })= ramène que les objets de postProducts model, avec type:"bijoux"

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
    const decoProducts = await postProducts.find({ type: 'Decoration' });//postProducts.find({ type: 'Bijoux' })= ramène que les objets de postProducts model, avec type:"bijoux"

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
    const productId = req.params.productId; //on utilise le endpoint de l'url grace a .params et on stock dans la variable productId
    const product = await postProducts.findById(productId); //On utilise la methode .findById() pour trouver 1 produit

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
    const updatedProductData = req.body; // Get the updated product data from the request body qu'on va utiliser dans findByIdAndUpdate() mongoose method pour changer la value du produit

  // Here we update the document in the MongoDB database using the findByIdAndUpdate() Mongoose method
  //productId= Find the specific document we want to update / updateProducteData= la new data ecrite dans le browser / { new: true }: tells Mongoose to return the UPDATED document after the update operation.
    const updatedProduct = await postProducts.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (updatedProduct) {
      res.json(updatedProduct);
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
    const deletedProduct = await postProducts.findByIdAndRemove(productId);

    if (deletedProduct) {
      res.json({ message: 'Product deleted successfully', deletedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
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
  console.log(`Example app listening ${port}`)
})

// !!!!! Run: npx nodemon server.js to run the server automatically when we make a change