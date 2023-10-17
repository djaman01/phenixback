//using the Express.js framework to create a simple HTTP server that interacts with a MongoDB database through Mongoose. 

//Importing Dependencies:
const express = require('express') //It imports the Express.js library for building web applications.
const app = express() //It creates an Express application instance called app
const port = 3005 //It sets the port variable to 3005, which is the port number on which the server will listen.
const db = require('./connect-db')
const {post, postProducts} = require('./model-doc')//on destructure les differnts models
//npm i cors
const multer = require('multer')
const path = require('path')
const cors = require('cors')
app.use(cors())

const nodemailer = require ('nodemailer'); //Pour envoyer le form au mail

const transporter = nodemailer.createTransport({ //Utilisation nodemailer
  service:"gmail",
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


//Handling POST Requests to the Root URL ("/") after http://localhost:3005 S'il n'y a rien après 3005 (port qu'on a décidé plus haut) on met "/" 
//On va définir ce qu'on va envoyer à la base de donnée MongoDB à parti du site

app.post('/', async(req, res) =>{
  const {Nom, Prenom, Ville, Mail, Telephone, Aide,  News} = req.body //On veut envoyer Nom, Prenom...etc à mongoDB
  
  const mailOptions = { //On veut aussi envoyer le tout à phenix.deals@gmail.com
    from: "phenix.deals@gmail.com",
    to: "phenix.deals@gmail.com",
    subject: "Contact Form phenixdeals.com",
    text: `Nom: ${Nom} \n Prenom: ${Prenom}\n Ville: ${Ville}\n Mail: ${Mail}\n Telephone: ${Telephone}\n Aide: ${Aide}\n News: ${Prenom}`
  }
  try{
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      } else{
        console.log("mail sent:" + info.response)
      }
    });
      const newPost = await post.create({Nom, Prenom, Ville, Mail, Telephone, Aide, News}); //It attempts to create a new document (record) in the MongoDB collection using the postModel.create() method. 
      res.json(newPost)//If the document is successfully created, it responds with the newly created document in JSON format.
  }catch(error){
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

// app.post('/upload', upload.single('file'), async (req, res) => {
//   const {nom, dimensions, matiere, prix, code} = req.body
//   try {
//     // Replace backslashes with forward slashes in the file path
//     const imageUrl = req.file.path.replace(/\\/g, '/');

//     // Access the "name" field from the request body
//     // const imageName = req.body.name;
    

//     // Save both the image URL and the image name in the database
//     const newImage = new postProducts({ imageUrl }); 
//     await newImage.save();

//     res.json({ imageUrl });
//     const newPost = await post.create({nom});
//     res.json(newPost)
//   } catch (error) {
//     console.error('Error saving image to the database:', error);
//     res.status(500).json({ error: 'Unable to save image' });
//   }
// });

// Route to handle image upload and product data storage
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Access the uploaded file path
    const imageUrl = req.file.path.replace(/\\/g, '/');

    // Extract product data from the request body
    const { nom, dimensions, matiere, prix, code } = req.body;

    // Create a new product using the Mongoose model and include the image URL
    const newProduct = new postProducts({
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
    res.json({imageUrl})
  } catch (error) {
    console.error('Error handling image upload and product data storage:', error);
    res.status(500).json({ error: 'Unable to upload image and store product data' });
  }
});


app.get('/api/images', async (req, res) => {
  try {
    // const images = await postModel.find({}, 'imageUrl'); // Retrieve only the imageUrl field
    const images = await postModel.find({}); // Retrieve only the imageUrl field

    const imageUrls = images.map((image) => image.imageUrl);
    res.json({ imageUrls });
    console.log("here is the pics");
  } catch (error) {
    console.error('Error fetching images from the database:', error);
    res.status(500).json({ error: 'Unable to fetch images' });
  }
});

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Starting the Server:
//This code starts the Express server and listens on the specified port (3005 in this case). 
app.listen(port, () => {
  console.log(`Example app listening ${port}`)
})

// !!!!! Run: npx nodemon server.js to run the server automatically when we make a change