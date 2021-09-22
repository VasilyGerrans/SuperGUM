import StickyHeader from './StickyHeader';
import CreatorContent from './CreatorContent';
import SubscriptionContent from './SubscriptionContent';
import './App.css';
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

function App () {
  const { isAuthenticated, isWeb3Enabled, enableWeb3, user } = useMoralis();

  const [ contentUnlocked, setContentUnlocked ] = useState(true);

  useEffect(() => {
    if (isAuthenticated === true && isWeb3Enabled === false) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  const walletButton = () => {
    console.log(isAuthenticated, isWeb3Enabled);
    setContentUnlocked(!contentUnlocked);
    if (isWeb3Enabled === false) {
      enableWeb3();
      console.log(user.attributes.ethAddress);
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
