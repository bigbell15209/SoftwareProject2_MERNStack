const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BeanSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    specie: {
        type:String,
        default: '',
        trim: true,
        required: 'specie cannot be blank'
    },
    origin: {
        type: String,
        default: '',
        trim: true,
        required: 'origin cannot be blank'
    },
    roastingLevel: {
        type: String, 
        default: '',
        trim: true
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    street:String,
	city:String,
	province:String,
	country:String,
    postal:String,
    seller: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
});

// Set the 'coffee Name' virtual property
BeanSchema.virtual('coffeeName').get(function() {
	return this.specie +' '+ this.roastingLevel + ' ' + this.origin;
}).set(function(coffeeName) {
	const splitName = coffeeName.split(' ');
	this.specie = splitName[0] || '';
	this.roastingLevel = splitName[1] || '';
    this.origin = splitName[2] || '';

});

mongoose.model('Bean', BeanSchema);
