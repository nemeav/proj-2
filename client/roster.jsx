const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const CharList = (props) => {
  const { chars, isPremium } = props;

  if (chars.length === 0) {
    return (
      <div className='charList'>
        <h3 className='emptyChar'>No Characters Yet!</h3>
      </div>
    );
  }

  const charNodes = chars.map(char => {
    let imgSrc;
    if (char.hasOwnProperty('link')) {
      imgSrc = char.link;
    } else {
      imgSrc = '/assets/img/default.jpg';
    }

    return (
      <div key={char._id} className='char'>
        <img src={imgSrc} alt='profile img' className='charPic' />
        <h3 className='charInfo'>Name: {char.name}</h3>
        <h3 className='charInfo'>Path: {char.path}</h3>
        <h3 className='charInfo'>Type: {char.type}</h3>

        {isPremium && (
          <>
            <h3 className='charInfo'>Association: {char.association}</h3>
            <h3 className='charInfo'>Rarity: {char.rarity}</h3>
            <h3 className='charInfo'>Date Added: {char.addedDate}</h3>
          </>
        )}
      </div>
    );
  });

  return (
    <div className='charList'>
      {charNodes}
    </div>
  );
};

const RosterPage = () => {
  const [chars, setChars] = React.useState([]);
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    const loadCharsFromServer = async () => {
      const response = await fetch('/getChars');
      const data = await response.json();
      setChars(data.chars);
    };

    loadCharsFromServer();
  }, []);

  const handleTogglePremium = () => {
    setIsPremium(!isPremium);
  };

  return (
    <div>
      <h2>Your Character Roster</h2>
      <label htmlFor="premiumToggle">Premium View:</label>
      <input
        type="checkbox"
        id="premiumToggle"
        checked={isPremium}
        onChange={handleTogglePremium}
      />

      <CharList chars={chars} isPremium={isPremium} />
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<RosterPage />);
};

window.onload = init;
