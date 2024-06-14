const fs = require('fs');
const multer = require('multer');
const path = require('path');
const storageSingle = require('./storageSingle');


const uploadSingle = multer({
    storage: storageSingle,
    limits: {
      fileSize: 2000000, // dalam byte, jadi 1000 byte = 1kb, 1000000 byte = 1mb
    },
    fileFilter: (req, file, callback) => {
      // file type yang diperbolehkan, dalam bentuk regex
      const filetypes = /jpeg|jpg|png|gif/;
      const fileExtension = path.extname(file.originalname).toLowerCase();
  
      const checkExtName = filetypes.test(fileExtension);
      const checkMimeType = filetypes.test(file.mimetype);
  
      if (checkExtName && checkMimeType) {
        callback(null, true);
      } else {
        callback(new Error("tipe data salah"), false);
      }
    },
  });

module.exports = uploadSingle