/**
 * Created by Chris on 7/8/2015.
 */

var mongoose = require('mongoose');
var ResumeModel = mongoose.model('resume_info', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    resume:{
        type: String,
        required: true
    },
    saved:{
        type: String,
        required: true
    },
    timestamp:{
        type:Object,
        required:true
    }

});
module.exports = ResumeModel;
