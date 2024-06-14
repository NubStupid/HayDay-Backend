const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storageSingle = multer.diskStorage({
    destination: (req, file, callback) => {
      // kalau req.body tidak terbaca, pastikan field dengan tipe file, berada dipaling bawah
      const foldername = `uploads/crop`;
  
      if (!fs.existsSync(foldername)) {
        fs.mkdirSync(foldername, { recursive: true });
      }
  
      callback(null, foldername);
    },
    filename: (req, file, callback) => {
      console.log(file);
      if(req.body.image == null){
        callback(null,`notFound.jpg`)
      }
      // ambil file extensionnya
      const fileExtension = path.extname(file.originalname).toLowerCase();
  
      // callback(null, "tes.jpg"); //ubah menjadi nama pilihan kita
      // callback(null, file.originalname); // pakai nama asli filenya
      req.url = `${req.body.crop_name}${fileExtension}`
        if(req.body.image == null){
            req.url = 'notFound.jpg'   
        }
      callback(null,req.url); //profpic.xlsx
    },
  });

module.exports = storageSingle

