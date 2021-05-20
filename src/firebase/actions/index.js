import firebase from '../index';

const submitScore = firebase.functions().httpsCallable('helloWorld');

export const handleSubmitScore = async () => {
  const res = await submitScore();
  
  return res;
}
