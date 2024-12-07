// IMPORT
const models = require('../models');

// reformatted bc eslint hates me
const { Account } = models;

// LOGIN FUNCS
const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// SIGNUP FUNCS
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

// PW FUNCS
const changePassword = (req, res) => {
  const { username, oldPw, newPw } = req.body;

  if (!username || !oldPw || !newPw) {
    return res.status(400).json({ error: 'All fields required!' });
  }

  // Authenticate the user with the old password
  Account.authenticate(username, oldPw, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    try {
      // Hash the new password
      const hash = await Account.generateHash(newPw);

      // Update the account password
      account.password = hash;
      await account.save();

      return res.json({ message: 'Password changed successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error changing password!' });
    }
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
};
