const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
}; 

const profileImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads");
  },
  filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      if(ext === '.mp4') {
          cb(null, Date.now().toString(16) + "-" + file.originalname);
      } else {
          cb(null, uuidv4() + "-" + Date.now() + ext);
      }
  },
}); 

const uploadFiles = multer({ storage, fileFilter });

let uploadProfileImage = multer({ storage: profileImage, fileFilter });

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString(16) + "-" + file.originalname + ".mp4");
  },
});

const uploadAudioFile = multer({
  preservePath: true,
  storage: audioStorage,
});

module.exports = { uploadProfileImage, uploadAudioFile, uploadFiles };
