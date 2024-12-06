const helper = require('./helper.js');
const React = require('react');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleChar = (e, onCharAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#charName').value;
  const altname = e.target.querySelector('#altName').value;
  const path = e.target.querySelector('#path').value;
  const type = e.target.querySelector('#type').value;
  const assoc = e.target.querySelector('#assoc').value;
  const rarity = e.target.querySelector('#rarity').value;

  if (!name || !path || !type || !assoc || !rarity) {
    helper.handleError('Field required');
    return false;
  }

  helper.sendPost(e.target.action, { name, altname, path, type, assoc, rarity }, onCharAdded);
  return false;
};

const CharForm = (props) => {
    return(
        <form id='charForm' //not actuall error - eslint hates me
        onSubmit={(e) => handleChar(e, props.triggerReload)}
        name="charForm"
        action='/maker'
        method='POST'
        className='charForm'>
            <label htmlFor='name'>Name: </label>
            <input id='charName' type="text" name="name" placeholder='Char Name' />
            <label htmlFor='altName'>Alt. Names: </label>
            <input id='altName' type="text" name="altName" placeholder='Char Name(s)' /><br></br><br></br>
            <label htmlFor='path'>Path: </label>
            <input id='path' type="text" name="path" placeholder='Path' />
            <label htmlFor='type'>Type: </label>
            <input id='type' type="text" name="type" placeholder='Type' />
            <label htmlFor='assoc'>Association: </label>
            <input id='assoc' type="assoc" name="assoc" placeholder='Associations' />
            <label htmlFor='rarity'>Rarity: </label>
            <input id='rarity' type="number" name="rarity" min={4} max={5} />
            <input className='makeCharSubmit' type='submit' value="Add Char" />
        </form>
    );
};

const CharList = (props) => {
    const [chars, setChars] = useState(props.chars);

    useEffect(() => {
        const loadCharsFromServer = async () => {
            const response = await fetch('/maker');
            const data = await response.json();
            setChars(data.Chars);
        };
        loadCharsFromServer();
    }, [props.reloadChars]);

    if (chars.length === 0) {
        return (
            <div className='charList'>
                <h3 className='emptyChar'>No Chars Yet!</h3>
            </div>
        );
    }

    const charNodes = chars.map(char => {
        return (
            <div key={char.id} className='char'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='charName'>Name: {char.name}</h3>
            </div>
        );
    });

    return (
        <div className='charList'>
            {charNodes}
        </div>
    );
};

const App = () => {
    const [reloadChars, setReloadChars] = useState(false);

    return (
        <div>
            <div id='makeChar'>
                <CharForm triggerReload={() => setReloadChars(!reloadChars)} />
            </div>
            <div id='chars'>
                <CharList chars={[]} reloadChars={reloadChars} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;