const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    joinCode: {
        type: String,
        required: true,
    },
    users: {
        type: [Object],
    },
    invited: {
        type: [Object],
    },
    admins: {
        type: [Object],
    },
    schedule: {
        type: [Object],
    },
    shifts: {
        type: [Object],
    },


});

module.exports = mongoose.model('Org', OrgSchema);