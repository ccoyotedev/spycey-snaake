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

  const [ error, setError ] = useState();

  const [ loaded, setLoaded ] = useState({
    gotchis: false,
    highscores: false,
  });

  // Load in gotchis
  useEffect(() => {
    if (!contract) return;
    const setUserGotchis = async () => {
      const gotchiRes = await getAavegotchisForUser();
      if (gotchiRes.status === 200) {
        setGotchis(gotchiRes.data);
      } else {
        console.log(gotchiRes);
        setError(gotchiRes);
      }
  
      setLoaded((prevState) => {
        return {
          ...prevState,
          gotchis: true,
        }
      });
    }

    setUserGotchis();
  }, [contract]);

  // Highscores Loaded
  useEffect(() => {
    if (highscores !== undefined) {
      setLoaded((prevState) => {
        return {
          ...prevState,
          highscores: true,
        }
      });
    }
  }, [highscores])

  const handleGotchiSelect = useCallback(async (gotchi) => {
    if (gotchi.tokenId === selectedGotchi?.tokenId) return;
  
    const tokenId = gotchi.tokenId.toString();
    const score = highscores?.find(item => item.tokenId === tokenId).score;
    setSelectedGotchi({...gotchi, highscore: score || 0 });

  }, [highscores, selectedGotchi])

  if (!loaded.gotchis || !loaded.highscores) {
    return (
      <div className="App">
        <h3 className="loading">
          Loading
        </h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="App">
        <h3 className="error-message">
          Error code - {error.status}
          <br />
          {error.error?.message}
        </h3>
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