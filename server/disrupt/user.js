var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages  schema
var signupSchema = new Schema({
    user: {
        type: String
        , required: true
    }
    , datetime: {
        type: String
        , required: true
    }
    , datee: {
        type: String
        , required: true
    }
    , friend: {
        type: String
        , required: true
    }
    , count: {
        type: Number
        , required: false
    }
    , stop: {
        type: Boolean
        , required: true
    }
});
signupSchema.pre('save', function (next) {
    var user = this;
    return next();
});
module.exports = mongoose.model('signup', signupSchema);
