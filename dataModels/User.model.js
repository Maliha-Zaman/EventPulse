const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    validate: {
      validator: function() {
        return this.isOAuth ? ['null', ''].includes(this.password) : true;
      },
      message: 'Password is required unless using OAuth.'
    }
  },
  isOAuth: {
    type: Boolean,
    default: false,
  },
  profession: {
    type: String,
  },
  hobby: {
    type: String,
  },
  profile_image: {
    type: String,
    default:'',
  },
  images: {
    type: [String],
    default:[],
  },
  audio: {
    type: String,
    default:'',
  },
  resetPasswordOTP: {
    type: String,
    default: null
},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;