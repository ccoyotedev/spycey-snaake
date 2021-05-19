import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './game/index.js';
    script.defer = true;
    script.onload = () => scriptLoaded();

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const scriptLoaded = () => {
    const Game = new window.game();
    Game.init();
  }


  return (
    <div className="App">
      <canvas id="scoreCanvas" className="scoreBoard"></canvas>
      <canvas id="canvas" className="gameCanvas"></canvas>
      <div id="" className="gameDiv" hidden></div>
    </div>
  );
}

export default App;
