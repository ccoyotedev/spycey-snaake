import { useEffect, useState } from 'react';
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
      Game.init(gotchi.highscore, gotchi, (score, gotchi) =>  handleHighscore(score, gotchi));
      setGame(Game);
    } else {
      game.resetGame(gotchi.highscore || 0, gotchi);
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
    <>
      <canvas id="scoreCanvas" className="scoreBoard"></canvas>
      <div className="game-wrapper">
        <canvas id="canvas" className="gameCanvas"></canvas>
        <div id="mobile-controls">
          <div type="button" className="btn up-arrow far fa-arrow-alt-circle-up" id="up"></div>
          <div type="button" className="btn left-arrow far fa-arrow-alt-circle-left" id="left"></div>
          <div type="button" className="btn right-arrow far fa-arrow-alt-circle-right" id="right"></div>
          <div type="button" className="btn down-arrow far fa-arrow-alt-circle-down" id="down"></div>
        </div>
      </div>
    </>
  )
}