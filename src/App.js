import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import SuperFluidSDK from '@superfluid-finance/js-sdk';
import StickyHeader from './StickyHeader';
import { fDAIxabi } from './abis/fDAIxabi';
import { tokens } from './config';
import Home from './Home';
import Creator from './Creator';
import './App.css';
import OnlyAvailableOnRinkeby from './subcomponents/OnlyAvailableOnRinkeby';

function App () {
  const { web3, Moralis, isAuthenticated } = useMoralis();
  const [ sf, setSf ] = useState({});
  const [ connected, setConnected ] = useState(true);
  const [ account, setAccount ] = useState("");
  const [ fDAIx, setfDAIx ] = useState({});
  const [ balance, setBalance ] = useState(0);
  const [ validNetwork, setValidNetwork ] = useState(true);

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
  }, [validNetwork]);

  useEffect(() => {
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

    web3.eth.net.getId()
    .then(id => {
      if (id === 4) {
        (async () => {
          if (provider) {
            const sf = new SuperFluidSDK.Framework({
              web3: web3
            });
      
            await sf.initialize();
      
            const fDAIx = new web3.eth.Contract(fDAIxabi, tokens.rinkeby.fDAIx);
      
            setfDAIx(fDAIx);
            setSf(sf);
      
            await getAccount();
          }
        })();
      } else {
        setValidNetwork(false);
      }
    });

    window.ethereum.on("networkChanged", id => {
      if (Number(id) === 4) {
        setValidNetwork(true);
      }
      else {
        setValidNetwork(false);
      }
    });
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
        setAccount("0x0000000000000000000000000000000000000000");
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
      setConnected(false);
    }
    else {
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
      {validNetwork === true ?
      <div>
        <StickyHeader 
          balance={balance} 
          getAccount={getAccount} 
          setAccount={setAccount}
          connected={connected} 
          account={account} 
          history={history}
        />
        <div>
          <Switch>
            <Route exact path="/">
              <Home
                web3={web3}
                Moralis={Moralis}
                account={account}
                connected={connected}
                isAuthenticated={isAuthenticated}
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
        </div>
      </div>
      :
      <OnlyAvailableOnRinkeby />
      }
    </div>
  );
}

export default App;
