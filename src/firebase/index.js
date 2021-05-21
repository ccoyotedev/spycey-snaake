import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
}

export default firebase.initializeApp(firebaseConfig);

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  // Stored on init
  const [highscores, setHighscores] = useState(undefined);

  const sortByScore = (a, b) => {
    return b.score - a.score;
  }

  const handleSubmitScore = async (score, gotchiData) => {
    const { name, tokenId } = gotchiData;
    const submitScore = firebase.functions().httpsCallable('submitScore');
    const res = await submitScore({tokenId, score, name});

    if (res.data.status === 200) {
      const highscoresCopy = [...highscores];
  
      const indexOfScore = highscoresCopy.findIndex(score => score.tokenId === tokenId);
      if (indexOfScore >= 0) {
        highscoresCopy[indexOfScore].score = score
      } else {
        highscoresCopy.push({
          tokenId: tokenId,
          score: score,
          name: name,
        })
      }

      highscoresCopy.sort(sortByScore);
      setHighscores(highscoresCopy);
    }

    return res.data;
  }
  
  const handleGetHighscores = async () => {
    const getHighscores = firebase.functions().httpsCallable('getHighscores');
    const res = await getHighscores();
    return res.data;
  }

  useEffect(() => {
    if (firebase === undefined) return;
  
    const getHighscores = async () => {
      const res = await handleGetHighscores();
      setHighscores(res);
    }

    getHighscores();
  }, [firebase])

  return (
    <FirebaseContext.Provider value={{
      highscores,
      handleSubmitScore
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => useContext(FirebaseContext);


