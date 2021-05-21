import { Web3Provider } from './web3';
import { FirebaseProvider } from './firebase';
import Home from './pages/home';

function App() {
  return (
    <Web3Provider>
      <FirebaseProvider>
        <Home />
      </FirebaseProvider>
    </Web3Provider>
  );
}

export default App;
