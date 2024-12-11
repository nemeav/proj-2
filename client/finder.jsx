const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleFind = (e) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#charName').value;

  if (!name) {
    helper.handleError('Character name required!');
    return false;
  }

  helper.sendPost(e.target.action, { name });

  return false;
};

const FindCharForm = () => {
  return (
      <form id="findCharForm" onSubmit={handleFind} action="/findChars" method="POST">
        <h2>Find and Add a Character:</h2>
        <label htmlFor="charName">Character Name:</label>
        <input id="charName" type="text" name="name" placeholder="Enter character" />
        <input type="submit" value="Add Character" />
      </form>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<FindCharForm />);
};

window.onload = init;
