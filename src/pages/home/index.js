import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../../web3';
import { handleGetHighscores } from '../../firebase/actions';
import { Leaderboard } from '../../components';
import './styles.css';
import { GotchiSelector } from '../../components/gotchiSelector';
import { GameContainer } from '../../components/gameContainer';

const Home = () => {
  const { getAavegotchisForUser, contract } = useWeb3();
  const [ gotchis, setGotchis ] = useState([]);
  const [ selectedGotchi, setSelectedGotchi ] = useState();
  const [ highscores, setHighscores ] = useState([]);

  const [ loaded, setLoaded ] = useState({
    gotchis: false,
    highscores: false,
  })

  useEffect(() => {
    if (!contract) return;
    const getHighscores = async () => {
      const res = await handleGetHighscores();
      setHighscores(res);
      setLoaded((prevState) => {
        return {
          ...prevState,
          highscores: true
        }
      })
    }

    const setUserGotchis = async () => {
      const gotchiRes = await getAavegotchisForUser();
      setGotchis(gotchiRes);
      setLoaded((prevState) => {
        return {
          ...prevState,
          gotchis: true
        }
      })
    }

    getHighscores();
    setUserGotchis();
  }, [contract]);

  const handleGotchiSelect = useCallback(async (gotchi) => {
    if (gotchi.tokenId === selectedGotchi?.tokenId) return;
  
    const tokenId = gotchi.tokenId.toString();
    const score = highscores.find(item => item.tokenId === tokenId).score;
    setSelectedGotchi({...gotchi, highscore: score || 0 });

  }, [highscores, selectedGotchi])

  if (!loaded.gotchis || !loaded.highscores) {
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
      <Leaderboard data={highscores} />
    </div>
  )
}

export default Home;