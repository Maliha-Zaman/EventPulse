const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {type: [String],
  default:[],},

//   attendees: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'  // Reference to the User model
// }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for organizer
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
