import { useEffect, useState } from 'react';
import { useWeb3 } from '../../web3';
import './styles.css';

const Home = () => {
  const { getAddress } = useWeb3();

  const [ user, setUser ] = useState();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './game/index.js';
    script.defer = true;
    script.onload = () => scriptLoaded();

    document.body.appendChild(script);

    setUserDetails();

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const setUserDetails = async () => {
    const address = await getAddress();
    console.log(address);
    setUser(address);
  }

  const scriptLoaded = () => {
    const Game = new window.game();
    Game.init();
  }

  return (
    <div className="App">
      <button onClick={() => null}>{user}</button>
      <canvas id="scoreCanvas" className="scoreBoard"></canvas>
      <canvas id="canvas" className="gameCanvas"></canvas>
      <div id="" className="gameDiv" hidden></div>
    </div>
  )
}

export default Home;