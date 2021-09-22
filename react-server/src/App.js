import StickyHeader from './StickyHeader';
import CreatorContent from './CreatorContent';
import SubscriptionContent from './SubscriptionContent';
import './App.css';
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

function App () {
  const { isAuthenticated, isWeb3Enabled, enableWeb3, user, Moralis } = useMoralis();

  const [ contentUnlocked, setContentUnlocked ] = useState(true);
  const [ sf, setSf ] = useState({}); 

  useEffect(() => {
    if (isAuthenticated === true && isWeb3Enabled === false) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    /* 
    Can be used later for dynamically changing the dapp appearance
    when the user connects their wallet. We're not including functionality
    for disconnecting. If the user decides to manually disconnect MetaMask, 
    that is not considered a normal way to interract with the dapp. The dapp
    would have to have authentication protections to ensure people can't
    arbitrarily disconnect MetaMask and then do something in an account belonging
    to that MetaMask account. (So, there will be checks on interacting with user
    details).

    We can later add a "Disconnect?" window when a user clicks on their wallet
    address button, but that is more of a "brushing up" feature.
    */
    console.log("web3 state changed");
  }, [isWeb3Enabled])

  const walletButton = () => {
    if (isWeb3Enabled === false) {
      enableWeb3();
    }
  }

  return (
    <div className="App">
      <StickyHeader walletButton={walletButton} isWeb3Enabled={isWeb3Enabled} user={user} />
      <CreatorContent />
      <SubscriptionContent unlocked={contentUnlocked} />
    </div>
  );
}

export default App;
