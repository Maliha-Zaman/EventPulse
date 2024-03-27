const express = require("express");
const router = express.Router();
const {
    getLogin,
    getRegister,
    postLogin,
    postRegister, 
    updateProfile,
    getProfileInfos,
    deleteProfile,
    getLogout,
    getLanding, 
    } = require("../controllers/auth.controllers");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);
router.get("/logout", getLogout);
router.get("/landing", getLanding); 
router.get("/profiles", getProfileInfos);
router.patch("/update-profile",  updateProfile);
router.delete("/delete-profile/:id", deleteProfile);

const {uploadProfileImage, uploadAudioFile} = require("../middlewares/image.middleware")
const {

  postProfileImage,postMultipleImages, getMultipleImages,
  postAudioFile,getProfileImage,
  } = require("../controllers/auth.controllers");
const ensureAuthenticated = require("../middlewares/auth.middleware");
router.post('/upload/single_image', uploadProfileImage.single('profile_image'),ensureAuthenticated, postProfileImage);
router.post('/upload/multiple_image', uploadProfileImage.array('images', 5), ensureAuthenticated, postMultipleImages);
router.get('/multiple_image', ensureAuthenticated, getMultipleImages);
router.get('/profile_image', ensureAuthenticated, getProfileImage);

router.post('/upload/audio', uploadAudioFile.single('audio'), postAudioFile);

module.exports = router;