import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import TOKEN_ABI from './abis/Token.json';
import config from './config.json';

function App() {

  const loadBlockChainData = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log('First account: ', accounts[0]);

    // Connect ethers to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const {chainId} = await provider.getNetwork();
    console.log('Network chainId: ', chainId)
    
    // Token smart contract
    const token = new ethers.Contract(config[chainId].DApp.address, TOKEN_ABI, provider);
    console.log('Token address: ', token.address);
    const symbol = await token.symbol();
    console.log('Symbol: ', symbol)
  };

  useEffect(() => {
    loadBlockChainData();
  }, []);

  return (
    <div>
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

        </section>
        <section className='exchange__section--right grid'>

        </section>
      </main>
    </div>
  );
}

export default App;
