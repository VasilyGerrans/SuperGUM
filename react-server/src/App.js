import StickyHeader from './StickyHeader';
import CreatorContent from './CreatorContent';
import SubscriptionContent from './SubscriptionContent';
import './App.css';
import { useState } from 'react';
import { useMoralis } from 'react-moralis';

function App () {
  const { isAuthenticated, isWeb3Enabled } = useMoralis();

  const [ contentUnlocked, setContentUnlocked ] = useState(true);

  const walletButton = () => {
    console.log(isAuthenticated, isWeb3Enabled);
    setContentUnlocked(!contentUnlocked);
  }

  return (
    <div className="App">
      <StickyHeader walletButton={walletButton} />
      <CreatorContent />
      <SubscriptionContent unlocked={contentUnlocked} />
    </div>
  );
}

export default App;
