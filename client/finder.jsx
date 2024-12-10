import React from 'react';
import { createRoot } from 'react-dom/client';
import helper from './helper';

const FindCharForm = () => {
  const handleFindChar = async (e) => {
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

  return (
    <form id="findCharForm" onSubmit={handleFindChar} action="/findChars" method="POST">
      <label htmlFor="charName">Character Name:</label>
      <input id="charName" type="text" name="name" placeholder="Enter character" required />
      <input type="submit" value="Add Character" />
    </form>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<FindCharForm />);
};

window.onload = init;
