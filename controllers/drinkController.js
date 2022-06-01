const model = require('../models/connections');
const rsvpModel = require('../models/rsvp');

exports.index = (req, res, next)=> {
    model.find()
    .then(connections=>res.render('./connections/index', {connections}))
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./connections/newConnection');
};

exports.create = (req, res, next) => {
    let drink = new model(req.body);
    drink.host = req.session.user;
    drink.save()
    .then(connection=>{
        req.flash('success', 'Connection has been created successfully');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);
            return res.redirect('back');
            }
            next(err);
    });
};

exports.show = (req, res, next)=> {
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpModel.count({connection: id, rsvp: "Yes"})])
    .then(connections=> {
        const [connection, rsvps] = connections;
        if(connection) {
            res.render('./connections/connection', {connection, user, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> next(err));
};

exports.edit = (req, res, next)=> {
    let id = req.params.id;
    model.findById(id)
    .then(connection=> {
        return res.render('./connections/editConnection', {connection});
    })
    .catch(err=> next(err));
};

exports.update = (req, res, next)=> {
    let connection = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
       return res.redirect('/connections/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });

};

exports.delete = (req, res, next)=> {
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(drink => {
      res.redirect('/connections');
    })
    .catch(err=>next(err));
};

exports.editRsvp = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOne({connection: id, user: req.session.user}).then(rsvp => {
        if (rsvp) {
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp: req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp => {
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err => {
                console.log(err);
                if (err.name === 'ValidationError') {
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        } else {
            let rsvp = new rsvpModel( {
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp => {
                res.redirect('/users/profile');
            })
            .catch(err => {
                req.flash('error', err.message);
                next(err);
            });
        }
    })
};

exports.deleteRsvp = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection: id, user: req.session.user})
    .then(rsvp => {
        req.flash('success', 'Successfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err => {
        req.flash('error', err.message);
        next(err);
    });
};