import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Card } from 'antd';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import SuperFluidSDK from '@superfluid-finance/js-sdk';
import StickyHeader from './StickyHeader';
import SubscriptionContent from './SubscriptionContent';
import Home from './Home';
import { Spinner } from 'react-bootstrap';
import { ERC20abi } from './abis/ERC20abi';
import { fDAIxabi } from './abis/fDAIxabi';
import { tokens } from './config';
import './App.css';
import Creator from './Creator';

function App () {
  const { web3, Moralis } = useMoralis();
  const [ contentUnlocked, setContentUnlocked ] = useState(true);
  const [ sf, setSf ] = useState({});
  const [ connected, setConnected ] = useState(true);
  const [ account, setAccount ] = useState(""); // belonging to the client
  const [ fDAI, setfDAI ] = useState({});
  const [ fDAIx, setfDAIx ] = useState({});
  const [ balance, setBalance ] = useState(0);

  const history = useHistory();

  useEffect(() => {
    const path = window.location.pathname.slice(1);
    if (web3.utils.isAddress(path) === false && window.location.pathname !== "/") {
      history.push("/"); 
    }
    else {
      (async () => {
        await initWeb3();
      })();
    }
  }, []);

  useEffect(() => {
    console.log("account has changed to", account);
    if (web3.utils.isAddress(account)) {
      if (account.toLowerCase() === window.location.pathname.slice(1).toLowerCase()) {
        history.push("/");
      }
      (async () => {
        await getBalance();
      })();
    }
  }, [account]);

  const initWeb3 = async () => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);

    if (provider) {
      const sf = new SuperFluidSDK.Framework({
        web3: web3
      });

      await sf.initialize();

      const fDAI = new web3.eth.Contract(ERC20abi, tokens.ropsten.fDAI);
      const fDAIx = new web3.eth.Contract(fDAIxabi, tokens.ropsten.fDAIx);

      setfDAI(fDAI);
      setfDAIx(fDAIx);
      setSf(sf);

      await getAccount();
    }
    else {
      console.log("CONNECT METAMASK");
    }
  }

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
        console.log("CONNECT TO METAMASK");
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
      history.push("/");
      setConnected(true);
      setAccount(accts[0]);
    }
  }

  const getBalance = async () => {
    try {
      if (account.length > 0) {
        await fDAIx.methods.balanceOf(account).call({from: account})
        .then(bal => {
          console.log("balance", bal, typeof(bal), typeof(Number(bal)));
          setBalance(Number(bal));
        });
      }
    }
    catch(e) {
      alert(e);
    }
  }

  return (
    <div className="App">
      <StickyHeader 
        balance={balance} 
        getAccount={getAccount} 
        setAccount={setAccount}
        connected={connected} 
        account={account} 
        history={history}
        // getPageAddress={getPageAddress}        
      />
      <div>
        <Card className="CreatorContent" bordered={true}>
          <Switch>
            <Route exact path="/">
              <Home
                web3={web3}
                Moralis={Moralis}
                account={account}
                connected={connected}
              />              
            </Route>
            <Route>
              <Creator 
                web3={web3}
                account={account}
                connected={connected}
                history={history}
                sf={sf}
              />              
            </Route>
          </Switch>
        </Card>
      </div>
      <SubscriptionContent unlocked={contentUnlocked} />
    </div>
  );
}

export default App;
