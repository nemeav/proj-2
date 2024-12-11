const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const CharSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  alternateNames: {
    type: Array,
    trim: true,
  },
  path: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  association: {
    type: String,
    required: true,
  },
  rarity: {
    type: Number,
    min: 4,
    required: true,
  },
  link: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  addedDate: {
    type: Date,
  },
});

CharSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  alternateNames: doc.altName,
  path: doc.path,
  type: doc.type,
  association: doc.assoc,
  rarity: doc.rarity,
  link: doc.link,
  addedDate: doc.addedDate,
});

const CharModel = mongoose.model('PlayersChars', CharSchema);
module.exports = CharModel;
