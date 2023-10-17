//using the Express.js framework to create a simple HTTP server that interacts with a MongoDB database through Mongoose. 

//Importing Dependencies:
const express = require('express') //It imports the Express.js library for building web applications.
const app = express() //It creates an Express application instance called app
const port = 3005 //It sets the port variable to 3005, which is the port number on which the server will listen.
const db = require('./connect-db')
const {post, postProducts} = require('./model-doc')//on destructure les differnts models, si on avait que 1 model, on ecrit juste une variable normale
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


//Handle route for Post request pour envoyer la data du contact vers la base de donnée MongoDB et le mail
app.post('/', async(req, res) =>{
  const {Nom, Prenom, Ville, Mail, Telephone, Aide,  News} = req.body //On destructure l'objet de req.body qui vient du front-end pour pouvoir l'utiliser facilement"
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
      const newPost = await postContact.create({Nom, Prenom, Ville, Mail, Telephone, Aide, News});//Vu qu'on utilise le model nommé "post" on fait post.create({destructure l'object que la variable post store})
      res.json(newPost)//Respond by creating a new document in json format if handle route success
  }catch(error){
      res.status(500).send(error)
    }
    
})

app.post('/addproduct', async(req, res) =>{
  
  const {nom, dimension, matiere, prix, code} = req.body 

  try{
      const newPost = await postProducts.create({nom, dimension, matiere, prix, code});
      res.json(newPost)
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

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Replace backslashes with forward slashes in the file path
    const imageUrl = req.file.path.replace(/\\/g, '/');

    // Access the "name" field from the request body
    const imageName = req.body.name;

    // Save both the image URL and the image name in the database
    const newImage = new postProducts({ imageUrl, Nom: imageName }); 
    await newImage.save();

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error saving image to the database:', error);
    res.status(500).json({ error: 'Unable to save image' });
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