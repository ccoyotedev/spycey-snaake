import { Web3Provider } from './web3';
import Home from './pages/home';

function App() {
  return (
    <Web3Provider>
      <Home />
    </Web3Provider>
  );
}

export default App;
