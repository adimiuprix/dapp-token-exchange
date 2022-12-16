import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import config from './config.json';
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents
} from './store/interactions';
import Navbar from './components/Navbar';
import Markets from './components/Markets';
import Balance from './components/Balance';

function App() {

  const dispatch = useDispatch();

  const loadBlockChainData = async () => {

    // Connect ethers to blockchain
    const provider = loadProvider(dispatch);
    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamsk when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch);
    })
    
    // Load token smart contract
    const DApp = config[chainId].DApp;
    const mETH = config[chainId].mETH;
    await loadTokens(provider, [DApp.address, mETH.address], dispatch)

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch);

    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    loadBlockChainData();
  });

  return (
    <div>
      <Navbar />
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          <Markets />
          <Balance />
        </section>
        <section className='exchange__section--right grid'>

        </section>
      </main>
    </div>
  );
}

export default App;
