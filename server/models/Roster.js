const mongoose = require('mongoose');

const GenericSchema = new mongoose.Schema({}, { strict: false });
const rosterModel = mongoose.model('HSRRoster', GenericSchema);

module.exports = rosterModel;
