const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    organizations: {
        type: [Object],
    },
    lastOrganization: {
        type: String,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    rank: {
        type: String,
        default: "user",
    },
    settings: {
        type: Object,
        default: {

        }
    }

});

module.exports = mongoose.model('User', UserSchema);