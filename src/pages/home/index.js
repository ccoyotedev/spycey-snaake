import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../../web3';
import { convertInlineSVGToBlobURL } from '../../helpers';
import { handleSubmitScore, handleGetHighscoreForTokenId, handleGetHighscores } from '../../firebase/actions';
import { Leaderboard } from '../../components';
import './styles.css';

const Home = () => {
  const { getAavegotchisForUser, contract } = useWeb3();
  const [ gotchis, setGotchis ] = useState([]);
  const [ game, setGame ] = useState();
  const [ selectedIndex, setSelectedIndex ] = useState(0);

  const [ highscores, setHighscores ] = useState([]);

  useEffect(() => {
    if (!contract) return;
    const getHighscores = async () => {
      const res = await handleGetHighscores();
      const results = Object.keys(res).map(key => {
        return {
          tokenId: key,
          score: res[key].score,
          name: res[key].name,
        }
      })
      setHighscores(results);
    }

    const setUserGotchis = async () => {
      const gotchiRes = await getAavegotchisForUser();
      setGotchis(gotchiRes);
    }

    getHighscores();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './game/index.js';
    script.defer = true;
    script.onload = () => setUserGotchis();

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [contract]);

  const newGame = () => {
    const Game = new window.game();
    const scores = gotchis.map((gotchi, index) => {
      return {
        tokenId: gotchi.tokenId,
        highscore: 0,
      }
    })
    Game.init(scores[0].highscore, gotchis[selectedIndex], (score, tokenId) => handleHighscore(score, tokenId));
    setGame(Game);
  }

  const handleGotchiSelect = async (i) => {
    if (game) {
      setSelectedIndex(i);
      const tokenId = gotchis[i].tokenId.toString();
      game.endGame();
      const score = await handleGetHighscoreForTokenId(tokenId);
      game.restartGame(score || 0, gotchis[i]);
    }
  }

  const handleHighscore = useCallback(async (score, gotchi) => {
    console.log(score, gotchi);
    const res = await handleSubmitScore(
      score,
      {
        name: gotchi.name,
        tokenId: gotchi.tokenId.toString(),
      }
    );
    console.log(res);

  }, []);

  // Init game on load
  useEffect(() => {
    if (gotchis.length > 0) {
      newGame();
    }
  }, [ gotchis ]);


  return (
    <div className="App">

      {gotchis.length > 0 && (
        <div>
          <img src={convertInlineSVGToBlobURL(gotchis[selectedIndex].svg)} alt="selected gotchi" />
          <label>
            Select gotchi:
            <select value={selectedIndex} onChange={(e) => handleGotchiSelect(e.target.value)}>
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
      <Leaderboard data={highscores} />
    </div>
  )
}

export default Home;