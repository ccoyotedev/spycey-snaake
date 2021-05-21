import { useEffect, useState, useCallback } from 'react';
import { useFirebase } from '../../firebase';
import './styles.css';

export const GameContainer = ({selectedGotchi}) => {
  const { handleSubmitScore } = useFirebase();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState();

  useEffect(() => {
    setLoading(true)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './game/index.js';
    script.defer = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    if (loading || !selectedGotchi) return;

    newGame(selectedGotchi);
  }, [loading, selectedGotchi]);

  const newGame = async (gotchi) => {
    if (!game) {
      const Game = new window.game();
      Game.init(gotchi.highscore, gotchi, (score, tokenId) => handleHighscore(score, tokenId));
      setGame(Game);
    } else {
      game.endGame();
      game.restartGame(gotchi.highscore || 0, gotchi);
    }
  }

  const handleHighscore = async (score, gotchi) => {
    const res = await handleSubmitScore(
      score,
      {
        name: gotchi.name,
        tokenId: gotchi.tokenId.toString(),
      }
    );
    console.log(res);
  };

  if (loading) return (
    <div>
      Loading...
    </div>
  )

  return (
    <div>
      <canvas id="scoreCanvas" className="scoreBoard"></canvas>
      <canvas id="canvas" className="gameCanvas"></canvas>
      <div id="" className="gameDiv" hidden></div>
    </div>
  )
}