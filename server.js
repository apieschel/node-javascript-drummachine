// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const now = Date.now();
    const date = new Date();
    const dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + "_" + date.getHours() + "h" + date.getMinutes() + "m";
    const path = file.fieldname + '_' + dateString;
    const dir = process.cwd() + '/public/music/' + path;
    console.log(dir);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    cb(null, 'public/music/'  + path);
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({storage: storage});

// security
const helmet = require('helmet');
app.use(helmet({
  frameguard: {
     action: 'deny'
  },
  noCache: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://api.glitch.com"],
      styleSrc: ["'self'", "https://button.glitch.me"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://button.glitch.me", "https://api.glitch.com"],
      imgSrc: ["'self'", "https://hyperdev.com", "https://glitch.com", "https://cdn.glitch.com", "https://s3.amazonaws.com"]
    }
   }
 }));

// https://stackoverflow.com/questions/38104090/how-can-i-read-files-from-directory-and-send-as-json-to-client
const fs = require('fs');
let path = process.cwd() + '/public/music/';
let logs = [];

function readDirectory(callback){
  fs.readdir(path, function(err, items) {
     logs.push(items);
     console.log(path);
     callback(logs);       
  }); 
}

app.get('/music', function(req,res){
   logs = []; 
   path = process.cwd() + '/public/music/';
   readDirectory(function(logFiles){
     res.json({files : logFiles});
   });
});

app.get('/music/directory', function(req,res){
   logs = [];
   path = process.cwd() + '/public/music/' + req.query.directory;
   readDirectory(function(logFiles){
     res.json({files : logFiles, directory: req.query.directory});
   });
});

app.post('/api/fileanalyse', upload.array('upfile', 20), function (req, res, next) {
  /*res.json(
    {
      name: req.file.originalname, 
      size: req.file.size, 
      mimetype: req.file.mimetype,
      path: req.file.path,
      destination: req.file.destination,
      folderName: req.body.title
    }
  );*/
  res.redirect('/');
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});