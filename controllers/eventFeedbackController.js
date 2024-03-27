
const Event = require('../dataModels/Event.model');
const EventRegistration = require('../dataModels/EventRegistration.model');
const EventFeedback = require('../dataModels/EventFeedback');

    const addEventFeedback = async (req, res) => {
        try {
            const { rating, comment } = req.body;
            const eventId = req.params.id; 
            const userId = req.user.id;
    
            // Check if user attended the event
            const registration = await EventRegistration.findOne({ event: eventId, user: userId });
            
            if (!registration) {
                return res.status(403).json({ error: 'User did not attend this event' });
            }
    
            // Check if the user is the organizer of the event
            const event = await Event.findById(eventId);
            if (event.organizer.toString() === userId) {
                return res.status(403).json({ error: 'Event organizers cannot rate or provide feedback for their own events' });
            }
    
            // Check if the current date is after the event date
            const currentDate = new Date();
            if (currentDate < event.date) {
                return res.status(403).json({ error: 'Feedback can only be given after the event date' });
            }
    
            const feedback = new EventFeedback({
                eventId,
                userId,
                rating,
                comment,
                timestamp: new Date()
            });
    
            await feedback.save();
            res.json({ message: 'Feedback added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
const getEventFeedback = async (req, res) => {
    try {
        const eventId = req.params.id;
        const feedbacks = await EventFeedback.find({ eventId }).populate('userId', 'name email'); // Assuming you want to populate user details

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ error: 'No feedback found for this event' });
        }

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    
    addEventFeedback,
    getEventFeedback,
};