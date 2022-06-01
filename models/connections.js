const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drinkSchema = new Schema({

    title: {type: String, required: [true, 'title is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, required: [true, 'content is required'], minLength: 
    [10, 'The content should have at least 10 characters']},
    date: {type: String, required: [true, 'date is required']},
    start: {type: String, required: [true, 'Start time is required']},
    end: {type: String, required: [true, 'End time is required']},
    topic: {type: String, required: [true, 'Topic is required']},
    image: {type: String, required: [true, 'Image URL required']},
    location: {type: String, required: [true, 'Location is required']}
    
});

//Collection name is stories in the database
module.exports = mongoose.model('connections', drinkSchema);