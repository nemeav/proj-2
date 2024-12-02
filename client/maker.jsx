const helper = require('./helper.js');
const React = require('react');

const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleChar = (e, onCharAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#charName').value;

  if (!name) {
    helper.handleError('Field required');
    return false;
  }

  helper.sendPost(e.target.action, { name }, onCharAdded);
  return false;
};

const CharForm = (props) => {
    return(
        <form id='charForm' //not actuall error - eslint hates me
        onSubmit={(e) => handleChar(e, props.triggerReload)}
        name="charForm"
        action='/addChar'
        method='POST'
        className='charForm'>
            <label htmlFor='name'>Name: </label>
            <input id='charName' type="text" name="name" placeholder='Char Name' />
            <input className='makeCharSubmit' type='submit' value="Make Char" />
        </form>
    );
};

const CharList = (props) => {
    const [chars, setChars] = useState(props.chars);

    useEffect(() => {
        const loadCharsFromServer = async () => {
            const response = await fetch('/addChar');
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