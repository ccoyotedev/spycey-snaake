import firebase from '../index';

const submitScore = firebase.functions().httpsCallable('submitScore');
const getHighscoreForTokenId = firebase.functions().httpsCallable('getHighscoreForTokenId');
const getHighscores = firebase.functions().httpsCallable('getHighscores');

export const handleSubmitScore = async (tokenId, score) => {
  const res = await submitScore({tokenId, score});
  return res.data;
}

export const handleGetHighscoreForTokenId = async (tokenId) => {
  const res = await getHighscoreForTokenId({tokenId});
  return res.data;
}
