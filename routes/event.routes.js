// eventRoutes.js

const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth.middleware");
const eventsImg = require('../middlewares/image.middleware');

const upload = eventsImg.uploadFiles;
const { postCreateEvent, 
    getCreateEvent , 
    getEvents,
    postMultiplefiles,
    getMultiplefiles,
    updatedevent, 
    deleteEvent,
    searchEventsByName,
    getEventsByDateRange,
    registerForEvent,
    getEventRegistrations ,
    updateMultipleFiles,
    deleteMultipleFiles,
    } = require('../controllers/event.controller');
const{addEventFeedback,getEventFeedback,} = require('../controllers/eventFeedbackController')
router.post("/create", ensureAuthenticated, postCreateEvent);
router.get('/create', getCreateEvent);
router.get('/getevents', ensureAuthenticated, getEvents);
router.patch('/:id', ensureAuthenticated, updatedevent);
router.delete('/:id', ensureAuthenticated, deleteEvent);
router.get('/search', ensureAuthenticated, searchEventsByName);
router.get('/date-range', ensureAuthenticated, getEventsByDateRange);
router.post('/:id/register', ensureAuthenticated, registerForEvent);              
router.get('/:id/registrations', ensureAuthenticated, getEventRegistrations);
router.post('/:id/createfeedback', ensureAuthenticated, addEventFeedback);
router.get('/:id/feedback',  ensureAuthenticated, getEventFeedback);
router.post('/create/:eventId/files', upload.array('files', 5), ensureAuthenticated, postMultiplefiles);
router.get('/multiple_image/:eventId', ensureAuthenticated, getMultiplefiles);
router.patch('/:eventId/updateFiles',ensureAuthenticated,updateMultipleFiles);
router.delete( '/:eventId/files', ensureAuthenticated,deleteMultipleFiles);
module.exports = router;
