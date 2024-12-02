// reformatted bc eslint hates me
const models = require('../models');

const { Chars } = models;

const makerPage = (req, res) => {
  res.render('app');
};

const findChars = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Character name required to add to team!' });
  }

  try {
    const { name } = req.body;

    const character = await models.HSRRoster.findOne({ name }).lean().exec();
    if (!character) {
      return res.status(404).json({ error: 'Character not found! Check spelling and spacing' });
    }

    const query = { owner: req.session.account._id, name };
    const existingChar = await models.PlayersChars.findOne(query).lean().exec();

    if (existingChar) {
      return res.status(400).json({ error: 'Character is already in your roster!' });
    }
    const newChar = new models.PlayersChars({
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

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const charData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newChar = new Chars(charData);
    await newChar.save();
    return res.status(201).json({ name: newChar.name });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const getChars = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Chars.find(query).select('name').lean().exec();

    return res.json({ chars: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving chars!' });
  }
};

module.exports = {
  makerPage,
  findChars,
  makeDomo,
  getChars,
};
