import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import config from './config.json';
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange
} from './store/interactions';

function App() {

  const dispatch = useDispatch();

  const loadBlockChainData = async () => {

    // Connect ethers to blockchain
    const provider = loadProvider(dispatch);
    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);
    // Fetch current account & balance from Metamsk
    const account = await loadAccount(provider, dispatch);
    console.log('First account: ', account);
    // Load token smart contract
    const DApp = config[chainId].DApp;
    const mETH = config[chainId].mETH;
    await loadTokens(provider, [DApp.address, mETH.address], dispatch)

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    await loadExchange(provider, exchangeConfig, dispatch);
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
