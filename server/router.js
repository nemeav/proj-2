const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getChars', mid.requiresLogin, controllers.Chars.getChars);

  //app.post('/findChars', mid.requiresLogin, controllers.Roster.findChars);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changePassword', mid.requiresSecure, controllers.Account.changePassword); // CHANGE

  app.get('/maker', mid.requiresLogin, controllers.Chars.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Chars.makeChar);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
