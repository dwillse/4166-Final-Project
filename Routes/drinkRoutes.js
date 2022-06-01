const express = require('express');
const controller = require('../controllers/drinkController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId, validateConnection, validateResult, validateRsvp} = require('../middlewares/validator');

const router = express.Router();

//GET /stories: send all stories to the user
router.get('/', controller.index);

//Get /stories/new: send html form for creating a new story
router.get('/new', isLoggedIn, controller.new);

//POST /stories: create a new story
router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /stories/:id: send details of story identified by Id
router.get('/:id', validateId, controller.show);

//GET /stories/id:/edit: send html from for editing an exisiting story
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /stories/:id: update the story identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateConnection, validateResult, controller.update);

//DELETE /stories/:id, delete the stories identified by the Id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//Posts /stories/:id/rsvp, puts the users rsvp into the database
router.post('/:id/rsvp', validateId, isLoggedIn, validateRsvp, validateResult, controller.editRsvp);

//Delete /stories/:id/rsvp, Deletes the users rsvp in the database
router.delete('/:id/rsvp', validateId, isLoggedIn, controller.deleteRsvp);

module.exports = router;