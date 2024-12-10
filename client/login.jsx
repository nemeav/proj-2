//IMPORTS
const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');


//FUNCS
const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();
  
  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();
  
  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2 });

  return false;
};


const handleChangePassword = async (e) => { // async to add update message, was being funky
  e.preventDefault();
  helper.hideError();
  
  const username = e.target.querySelector('#user').value;
  const oldPw = e.target.querySelector('#oldPw').value;
  const newPw = e.target.querySelector('#newPw').value;
  const newPw2 = e.target.querySelector('#newPw2').value;

  if (!username || !oldPw || !newPw || !newPw2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (newPw !== newPw2) {
    helper.handleError('Passwords must match!');
    return false;
  }

  const res = await helper.sendPost('/changePassword', { username, oldPw, newPw });

  if (res.ok) {
    console.log(res.message);
    window.location.href = '/login';
  }
  return false;
}


//FORMS/VIEWS
const LoginWindow = (props) => {
  return (
      
      <form id='loginForm' //dumb error bc eslint hates me in particular - does not effect program
        name='loginForm'
        onSubmit={handleLogin}
        action='/login'
        method='POST'
        className='mainForm'>
        <label htmlFor='username'>Username: </label>
        <input id='user' type='text' name='username' placeholder='Enter name' /><br></br>
        <label htmlFor='pass'>Password: </label>
        <input id='pass' type='password' name='pass' placeholder='Enter password' />
        <input className='formSubmit' type='submit' value='Sign in' />
      </form>
    
  );
};

const SignupWindow = (props) => {
  return (
    <form id='signupForm'
      name='signupForm'
      onSubmit={handleSignup}
      action='/signup'
      method='POST'
      className="mainForm">
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='Enter username' /><br></br>
      <label htmlFor="pass">Password: </label>
      <input id='pass' type='password' name='pass' placeholder='Enter password' /><br></br>
      <label htmlFor='pass'>Password: </label>
      <input id='pass2' type='password' name='pass2' placeholder='Retype password' />
      <input className='formSubmit' type="submit" value="Sign up" />
    </form>
  );
};

const ChangePasswordWindow = () => {
  return (
    <form id='changePasswordForm'
      name='changePasswordForm'
      onSubmit={handleChangePassword}
      action='/changePassword'
      method='POST'
      className='mainForm'
    >
      <label htmlFor="user">Username: </label>
      <input id="user" type="text" name="username" placeholder="Enter username" />
      <label htmlFor="oldPw">Current Password: </label>
      <input id="oldPw" type="password" name="oldPw" placeholder="Current password" /><br></br>
      <label htmlFor="newPw">New Password: </label>
      <input id="newPw" type="password" name="newPw" placeholder="New password" />
      <label htmlFor="newPw2">New Password: </label>
      <input id="newPw2" type="password" name="newPw2" placeholder="Confirm new password" />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  )
}


//CONNECT TO FE
const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');
  const pwButton = document.getElementById('changePwButton');

  const root = createRoot(document.getElementById('content'));

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    pwButton.hidden = false;
    root.render(<LoginWindow />);
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    pwButton.hidden = true;
    root.render(<LoginWindow />);
    return false;
  });

  pwButton.addEventListener('click', (e) => {
    e.preventDefault();
    pwButton.hidden = true;
    root.render(<ChangePasswordWindow />);
    return false;
  });

  root.render(<LoginWindow />);
};

window.onload = init;