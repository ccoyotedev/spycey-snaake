import { useEffect, useState } from 'react';
import { useWeb3 } from '../../web3';
import { convertInlineSVGToBlobURL } from '../../helpers';
import './styles.css';

const Home = () => {
  const { getAavegotchisForUser, contract } = useWeb3();
  const [ scriptLoaded, setScriptLoaded ] = useState(false);
  const [ gotchis, setGotchis ] = useState([]);
  const [ selectedIndex, setSelectedIndex ] = useState(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './game/index.js';
    script.defer = true;
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const setUserGotchis = async () => {
      const gotchiRes = await getAavegotchisForUser();
      setGotchis(gotchiRes);
    }

    if (scriptLoaded && contract) {
      setUserGotchis();
      const Game = new window.game();
      Game.init();
    }
  }, [scriptLoaded, contract, getAavegotchisForUser]);


  return (
    <div className="App">

      {gotchis.length > 0 && (
        <div>
          <img src={convertInlineSVGToBlobURL(gotchis[selectedIndex].svg)} alt="selected gotchi" />
          <label>
            Select gotchi:
            <select value={selectedIndex} onChange={(e) => setSelectedIndex(e.target.value)}>
              {gotchis.map((gotchi, i) => {
                return (
                  <option value={i}>{gotchi.name}</option>
                )
              })}
            </select>
          </label>
        </div>
      )}
      <canvas id="scoreCanvas" className="scoreBoard"></canvas>
      <canvas id="canvas" className="gameCanvas"></canvas>
      <div id="" className="gameDiv" hidden></div>
    </div>
  )
}

export default Home;