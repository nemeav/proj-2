const mongoose = require('mongoose');

const GenericSchema = new mongoose.Schema({}, { strict: false });
const RosterModel = mongoose.model('HSRRoster', GenericSchema);

module.exports = RosterModel;
