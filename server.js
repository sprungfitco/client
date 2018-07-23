var express = require('express');
let router = express.Router();
let bodyParser        = require('body-parser');
let methodOverride    = require('method-override')
let Multer = require('multer');
let cors              = require('cors');
let fetch = require('node-fetch');
const imgUpload = require('./web/src/lib/imgUpload');

const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
});
const PJWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPa3lKbi1lZVFTT1ozRjdSbzBkT2tRIiwiZXhwIjoxNjQ2MjU5MDIyfQ.VUuLOHc9saKr7BN-vAFUSEKNYcjds5wTX8PG39b9KOk';
const CREATE_MEETING_URL = `https://api.zoom.us/v2/users/pinkesh@sprungspot.com/meetings?access_token=${PJWT_TOKEN}`;
var app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(methodOverride())

app.use(express.static(__dirname + '/'));

app.use(function(err, req, res, next){
  res.apiError(err);
})
app.use(router);

app.post('/createMeeting',(req, response)=>{
  query = req.body;
  fetch(`${CREATE_MEETING_URL}`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      "Content-Type":'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    console.log('booked a class, url is ' + res.start_url);
    console.log(res);
    response.send(res);
  }).catch(err=>console.log);
});

// the multer accessing the key 'image', as defined in the `FormData` object on the front end
// Passing the uploadToGcs function as middleware to handle the uploading of request.file
router.post('/image-upload', multer.single('image'), imgUpload.uploadToGcs, function(request, response, next) {
  const data = request.body;
  if (request.file && request.file.cloudStoragePublicUrl) {
    data.imageUrl = request.file.cloudStoragePublicUrl;
  }
  response.send(data);
})

app.listen(process.env.PORT || 8080, function(err, res){
  if(err) throw err;
  console.log('server start at 8080');
  return;
});
