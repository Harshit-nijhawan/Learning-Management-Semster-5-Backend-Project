const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: function(req, file, cb){
        crypto.randomBytes(12, function(err, bytes){
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(err, fn);
        })
    }
});

const upload = multer({ storage: storage });

module.exports = upload;