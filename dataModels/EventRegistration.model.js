

const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'  // Reference to the Event model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'   // Reference to the User model
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const EventRegistration = mongoose.model("EventRegistration", EventRegistrationSchema);
module.exports = EventRegistration;
