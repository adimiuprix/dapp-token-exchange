import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import config from './config.json';
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken
} from './store/interactions';

function App() {

  const dispatch = useDispatch();

  const loadBlockChainData = async () => {
    const account = await loadAccount(dispatch);
    console.log('First account: ', account);
    
    // Connect ethers to blockchain
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    
    // Token smart contract
    await loadToken(provider, config[chainId].DApp.address, dispatch)
    // const symbol = await token.symbol();
    // console.log('Symbol: ', symbol)
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
