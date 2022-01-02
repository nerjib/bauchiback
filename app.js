const express = require('express')
const http = require('http')
const dotenv = require('dotenv');
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary');

const BAUPunits = require('./src/controllers/punits')
const BAUVotes = require('./src/controllers/votes')
const BAUIncidents = require('./src/controllers/incidents')


app.use(cors())

http.createServer(app);

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));



app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();


app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
    distination: function (req, file, cb) {
      cb(null, './src');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/gif'||'image/png') {
      cb(null, true);
    } else {
      cb(new Error('image is not gif'), false);
    }
  };
  
  const upload = multer({
    storage,
    fileFilter,
  });
  

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.headers('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
      return res.status(200).json({});
    }
    next();
  });
  
  

     
app.get('/', function(req,res){
res.json({
    m:'sdg'
})
})

app.use('/api/v1/baupunits', BAUPunits)
app.use('/api/v1/bauresults', BAUVotes)
app.use('/api/v1/bauincidents', BAUIncidents )


// ussd feedback


    
module.exports = app;