import StickyHeader from './StickyHeader';
import CreatorContent from './CreatorContent';
import SubscriptionContent from './SubscriptionContent';
import './App.css';
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import detectEthereumProvider from '@metamask/detect-provider';
import SuperFluidSDK from '@superfluid-finance/js-sdk';
import Web3 from 'web3';

function App () {
  const [ isAuthenticated ] = useMoralis();
  const [ contentUnlocked, setContentUnlocked ] = useState(true);
  const [ sf, setSf ] = useState({});
  const [ connected, setConnected ] = useState(true);
  const [ account, setAccount ] = useState(""); 

  /* useEffect(() => {
    if (isAuthenticated === true && isWeb3Enabled === false) {
      enableWeb3();
    }
  }, [isAuthenticated]); */

  useEffect(() => {
    (async () => {
      await initWeb3();
    })();
  }, []);

  const initWeb3 = async () => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);

    if (provider) {
      const sf = new SuperFluidSDK.Framework({
        web3: web3
      });

      await sf.initialize();

      await getAccount();

      setSf(sf);

      console.log("Successfully initialized");
    }
    else {
      console.log("NO METAMASK DETECTED");
    }
  }

  const displayConnectWallet = () => (connected === false || account === "" || account === undefined);

  const getAccount = async () => {
    const acct = await window.ethereum.request({method: 'eth_accounts'});
    if (acct.length > 0) {
      setConnected(true);
      setAccount(acct[0]);
    }
    else if (acct.length === 0) {
      setConnected(false);
      setAccount("");
    }

    let currentAccount = acct[0];
    window.ethereum.
    request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch(err => {
      console.error(err);
    });

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      }
      else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
      }
    }
    window.ethereum.on('accountsChanged', isConnected, handleAccountsChanged);
  }

  const isConnected = () => {
    let accts = window.ethereum._state.accounts;

    if (accts.length === 0) {
      console.log("NOT CONNECTED");
      setConnected(false);
    }
    else {
      console.log("CONNECTED");
      setAccount(accts[0]);
      setConnected(true);
    }
  }

  const getBalance = () => {
    console.log("'Getting balance'");
  }

  return (
    <div className="App">
      <StickyHeader getAccount={getAccount} connected={connected} account={account} displayConnectWallet={displayConnectWallet} />
      <CreatorContent />
      <SubscriptionContent unlocked={contentUnlocked} />
    </div>
  );
}

export default App;
