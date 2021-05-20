import firebase from '../index';

const submitScore = firebase.functions().httpsCallable('submitScore');
const getHighscoreForTokenId = firebase.functions().httpsCallable('getHighscoreForTokenId');
const getHighscores = firebase.functions().httpsCallable('getHighscores');

export const handleSubmitScore = async (score, gotchiData) => {
  const { name, tokenId } = gotchiData;
  const res = await submitScore({tokenId, score, name});
  return res.data;
}

export const handleGetHighscoreForTokenId = async (tokenId) => {
  const res = await getHighscoreForTokenId({tokenId});
  return res.data;
}

export const handleGetHighscores = async () => {
  const res = await getHighscores();
  return res.data;
}
