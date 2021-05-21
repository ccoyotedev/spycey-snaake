import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../../web3';
import { useFirebase } from '../../firebase';
import { Leaderboard } from '../../components';
import './styles.css';
import { GotchiSelector } from '../../components/gotchiSelector';
import { GameContainer } from '../../components/gameContainer';

const Home = () => {
  const { getAavegotchisForUser, contract } = useWeb3();
  const { highscores } = useFirebase();

  const [ gotchis, setGotchis ] = useState([]);
  const [ selectedGotchi, setSelectedGotchi ] = useState();

  const [ loaded, setLoaded ] = useState(true);

  useEffect(() => {
    if (!contract || highscores === undefined) return;

    const setUserGotchis = async () => {
      const gotchiRes = await getAavegotchisForUser();
      setGotchis(gotchiRes);
      setLoaded(true);
    }

    setUserGotchis();
  }, [contract, highscores]);

  const handleGotchiSelect = useCallback(async (gotchi) => {
    if (gotchi.tokenId === selectedGotchi?.tokenId) return;
  
    const tokenId = gotchi.tokenId.toString();
    const score = highscores.find(item => item.tokenId === tokenId).score;
    setSelectedGotchi({...gotchi, highscore: score || 0 });

  }, [highscores, selectedGotchi])

  if (!loaded) {
    return (
      <div className="App">
        Loading
      </div>
    )
  }

  return (
    <div className="App">

      {gotchis.length > 0 && (
        <GotchiSelector gotchis={gotchis} handleSelect={handleGotchiSelect} />
      )}
      <GameContainer selectedGotchi={selectedGotchi} />
      <Leaderboard />
    </div>
  )
}

export default Home;