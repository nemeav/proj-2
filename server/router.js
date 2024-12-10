const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // adder funcs
  app.get('/findChars', mid.requiresLogin, controllers.Chars.findCharsPage);
  app.post('/findChars', mid.requiresLogin, controllers.Chars.findChars);

  // account funcs
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changePassword', mid.requiresSecure, controllers.Account.changePassword);

  // OC creator/maker
  app.get('/maker', mid.requiresLogin, controllers.Chars.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Chars.makeChar);

  // roster
  app.get('/roster', mid.requiresLogin, controllers.Chars.getRoster);
  app.get('/getChars', mid.requiresLogin, controllers.Chars.getChars);

  // index
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
