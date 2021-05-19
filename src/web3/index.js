import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from 'ethers';
import diamondAbi from './abi/diamond.json';

const aavegotchiAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [ isConnected, setIsConnected ] = useState(false);
  const [ provider, setProvider ] = useState();
  const [ contract, setContract ] = useState();
  const [ signer, setSigner ] = useState();

  const connectToNetwork = async () => {
    await window.ethereum.enable();
    setIsConnected(true);
  };

  useEffect(() => {
    if (window.ethereum && isConnected) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const newContract = new ethers.Contract(aavegotchiAddress, diamondAbi, newProvider);
      const newSigner = newProvider.getSigner();

      setProvider(newProvider);
      setContract(newContract);
      setSigner(newSigner);
    } else {
      connectToNetwork();
    }
  }, [isConnected]);

  const getAddress = async () => {
    return signer.getAddress();
  }

  return (
    <Web3Context.Provider value={{
      provider,
      contract,
      signer,
      getAddress,
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context);
