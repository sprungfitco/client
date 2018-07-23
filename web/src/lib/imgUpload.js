'use strict';
const storage = require('@google-cloud/storage');
const projectId = require('../../config/index');

const gcs = storage({
  projectId: projectId,
  credentials: require('../../config/DEV-Service-Backend-4cf8f7dd3d35.json')
});

const bucketName = 'sprung-profile-pictures'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let imgUpload = {};

imgUpload.uploadToGcs = (req, res, next) => {
  if(!req.file) return next();

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
    });
  });
  stream.end(req.file.buffer);
}

module.exports = imgUpload;
