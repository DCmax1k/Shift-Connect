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
    employees: {
        type: [Object],
    },
    invited: {
        type: [Object],
    },
    admins: {
        type: [String],
    },
    shifts: {
        type: [Object],
    },


});

module.exports = mongoose.model('Org', OrgSchema);