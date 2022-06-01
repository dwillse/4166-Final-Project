const {body} = require('express-validator');
const {validationResult} = require('express-validator');


exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};


exports.validateSignUp = 
[
    body('firstName', "First name can't be empty").notEmpty().trim().escape(),
    body('lastName', "last name can't be empty").notEmpty().trim().escape(),
    body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({mix: 8, max: 64})
];

exports.validateLogin =
[
    body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({mix: 8, max: 64})
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else 
    {
        return next();
    }
};

exports.validateRsvp = [body('rsvp').isIn(['Yes', 'No', 'Maybe'])];

exports.validateConnection = 
[
    body('title', "Title can't be empty").notEmpty().trim().escape(),
    body('content', 'Content must be at least 10 characters').isLength({mix: 8}),
    body('date', "Date Can't be empty").notEmpty().trim().escape(),
    body('start','Start time cant be empty').notEmpty().trim().escape(),
    body('end', "End time can't be empty").notEmpty().trim().escape(),
    body('topic', "Topic can't be emtpy").notEmpty().trim().escape(),
    body('image', "Image can't be emtpy").notEmpty().trim().escape(),
    body('location', "Location can't be emtpy").notEmpty().trim().escape()
];

    