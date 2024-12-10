// reformatted bc eslint hates me
const models = require('../models');
const CharModel = require('../models/Chars');

const { Chars } = models;

const makerPage = (req, res) => {
  res.render('app', { username: req.session.account.username });
};

const findCharsPage = (req, res) => {
  res.render('findChars', { username: req.session.account.username });
};

const makeChar = async (req, res) => {
  console.log(req.body);
  if (!req.body.name || !req.body.path || !req.body.type || !req.body.assoc || !req.body.rarity) {
    return res.status(400).json({ error: 'Name, path, type, associations, and rarity required!' });
  }

  const charData = {
    name: req.body.name,
    alternateName: [],
    path: req.body.path,
    type: req.body.type,
    association: req.body.assoc,
    rarity: req.body.rarity,
    owner: req.session.account._id,
  };

  try {
    const newChar = new Chars(charData);
    await newChar.save();
    return res.status(201).json({ newChar });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Char already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred adding character!' });
  }
};

const getRoster = async (req, res) => {
  try {
    const characters = await CharModel.find({ owner: req.session.account._id }).lean().exec();
    res.render('roster', { username: req.session.account.username, characters });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error retrieving roster!' });
  }
};

const findChars = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Character name required to add to team!' });
  }

  try {
    const character = await models.Roster.findOne({ name }).lean().exec();
    if (!character) {
      return res.status(404).json({ error: 'Character not found! Check spelling/grammar' });
    }

    const query = { owner: req.session.account._id, name };
    const existingChar = await models.Chars.findOne(query).lean().exec();

    if (existingChar) {
      return res.status(400).json({ error: 'Character is already in your roster!' });
    }

    const newChar = new models.Chars({
      name: character.name,
      type: character.type,
      path: character.path,
      association: character.association,
      rarity: character.rarity,
      owner: req.session.account._id, // Link it to the signed-in user
    });

    await newChar.save();

    return res.status(201).json({ message: 'Character added!', character: newChar });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while adding character' });
  }
};

const getChars = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await CharModel.find(query).lean().exec();

    return res.json({ chars: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving chars!' });
  }
};

module.exports = {
  makerPage,
  findCharsPage,
  makeChar,
  getRoster,
  findChars,
  getChars,
};
