const Event = require('../dataModels/Event.model');
const path = require("path");
const EventRegistration = require('../dataModels/EventRegistration.model');

const getCreateEvent = (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "createEvent.html");
  res.sendFile(filePath);
};
const postCreateEvent = async (req, res) => {
    try {
        const { eventName, date, time, location, description, files } = req.body;
        const organizerId = req.user.id;  // Assuming you have set up authentication middleware

        const event = new Event({
            eventName,
            date,
            time,
            location,
            description,
            files,
            organizer: organizerId
        });

        await event.save();
        res.status(201).json({ message: 'Event created successfully!' });
        console.log("Event object:", {
          eventName,
          date,
          time,
          location,
          description,
          files,
          organizer: organizerId
      });
    } catch (error) {
      console.error("Error creating event:", error); // Log the actual error
      res.status(500).json({ error: 'Error creating event' });
    }};
    
  
const getEvents = async (req, res) => {

  try {
    const events = await Event.find();  // Fetch all events from the database
    res.json(events);  // Send the events as a JSON response
} catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
}
};


  const postMultiplefiles = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Not found" });
        }

        if (req.files) {
            event.files = [...event.files, ...req.files.map(file => file.filename)];
        }

        await event.save();
        res.json({ message: 'files added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getMultiplefiles = async(req,res)=>{
  try{
  const eventId = req.params.eventId
    const event = await Event.findById(eventId);
    const files= event.files
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateMultipleFiles = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { filesToUpdate } = req.body; 

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.files = filesToUpdate;
    await event.save();

    res.json({ message: 'Files updated successfully', updatedFiles: event.files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteMultipleFiles = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { filesToDelete } = req.body; 

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.files = event.files.filter(file => !filesToDelete.includes(file));

    await event.save();

    res.json({ message: 'Files deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updatedevent = async (req, res) => {
  try {
    const updatedevent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedevent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event updated successfully", task: updatedevent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Use the deleteOne() method to remove the event
    await Event.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchEventsByName = async (req, res) => {
  try {
      // Extract the event name from the query parameter
      const eventName = req.query.name;

      // Check if eventName exists in the query parameter
      if (!eventName) {
          return res.status(400).json({ error: 'Event name is required for searching.' });
      }

      // Perform the search based on the eventName
      const events = await Event.find({ eventName: { $regex: eventName, $options: 'i' } });

      if (events.length === 0) {
          return res.status(404).json({ message: 'No events found with the given name.' });
      }

      res.json(events); // Return the found events as a JSON response
  } catch (error) {
      res.status(500).json({ error: 'Error searching events by name.' });
  }
};
const getEventsByDateRange = async (req, res) => {
  try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Both start date and end date are required.' });
      }

      const events = await Event.find({
          date: {
              $gte: new Date(startDate),  // Greater than or equal to start date
              $lte: new Date(endDate)     // Less than or equal to end date
          }
      });

      if (events.length === 0) {
          return res.status(404).json({ message: 'No events found within the given date range.' });
      }

      res.json(events); // Return the found events as a JSON response
  } catch (error) {
      res.status(500).json({ error: 'Error fetching events by date range.' });
  }
};


const registerForEvent = async (req, res) => {
  try {
      const eventId = req.params.id; 
      console.log("Received request body:", eventId); 

      const userId = req.user.id;
      const event = await Event.findById(eventId);
      console.log(event);
      
      if (!event) {
          return res.status(404).json({ 
              error: 'Event not found', 
              receivedEventId: eventId, 
              receivedUserId: userId 
          });
      }

      const existingRegistration = await EventRegistration.findOne({ event: eventId, user: userId });
      if (existingRegistration) {
          return res.status(400).json({ error: 'User is already registered for this event' });
      }

      const registration = new EventRegistration({
          event: eventId,
          user: userId
      });

      await registration.save();
      res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Get Registrations for an Event
const getEventRegistrations = async (req, res) => {
  try {
      const eventId = req.params.id;

      const registrations = await EventRegistration.find({ event: eventId }).populate('user', 'name email'); // Populate user details
      res.json(registrations);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



   
module.exports = {postCreateEvent,
                   getCreateEvent,
                   getEvents,
                  postMultiplefiles,
                updatedevent,
              deleteEvent,
              searchEventsByName,
              getEventsByDateRange,
              registerForEvent,
              getEventRegistrations,
              getMultiplefiles,
              updateMultipleFiles,
              deleteMultipleFiles,
            };
