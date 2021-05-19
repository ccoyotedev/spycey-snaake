import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from 'ethers';
import diamondAbi from './abi/diamond.json';

const aavegotchiAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  // Stored on init
  const [ isConnected, setIsConnected ] = useState(false);
  const [ provider, setProvider ] = useState();
  const [ contract, setContract ] = useState();
  const [ signer, setSigner ] = useState();

  // Stored after initial call
  const [ address, setAddress ] = useState();
  const [ usersGotchis, setUsersGotchis ] = useState([]);

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
    if (address) return address;

    const resAddress = await signer?.getAddress();
    setAddress(resAddress);
    return resAddress;
  }

  const getAavegotchisForUser = async () => {
    if (usersGotchis.length > 0) return usersGotchis;

    const account = await getAddress();
    const gotchis = await contract?.allAavegotchisOfOwner(account);
    const gotchisWithSVGs = await _getAllAavegotchiSVGs(gotchis || []);
    setUsersGotchis(gotchisWithSVGs);
    return gotchisWithSVGs;
  };

  const _getAavegotchiSvg = async (tokenId) => {
    const svg = await contract.getAavegotchiSvg(tokenId);
    return svg;
  };

  const _getAllAavegotchiSVGs = async (gotchis) => {
    return Promise.all(
      gotchis.map(async (gotchi) => {
        const svg = await _getAavegotchiSvg(gotchi.tokenId);
        return {
          ...gotchi,
          svg,
        };
      }),
    );
  };

  return (
    <Web3Context.Provider value={{
      provider,
      contract,
      signer,
      getAddress,
      getAavegotchisForUser,
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context);
