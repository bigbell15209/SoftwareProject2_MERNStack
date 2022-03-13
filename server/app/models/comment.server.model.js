const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        default: '',
        trim: true,
        required: 'Rating cannot be blank'
    },

    content: {
        type: String, 
        default: '',
        trim: true
    },

    commenter: {
        type: Schema.ObjectId,  
        ref: 'User'
    },

    review: {
        type: Schema.ObjectId,  
        ref: 'Bean'
    }
});
mongoose.model('Comment', CommentSchema);
