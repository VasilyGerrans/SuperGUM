import StickyHeader from './StickyHeader';
import CreatorContent from './CreatorContent';
import SubscriptionContent from './SubscriptionContent';
import { useState, useEffect } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import detectEthereumProvider from '@metamask/detect-provider';
import SuperFluidSDK from '@superfluid-finance/js-sdk';
import Web3 from 'web3';
import { calculateStream } from './config';
import { ERC20abi } from './abis/ERC20abi';
import { fDAIxabi } from './abis/fDAIxabi';
import { tokens, PAGES } from './config';
import './App.css';

function App () {
  const { web3, Moralis } = useMoralis();
  const [ contentUnlocked, setContentUnlocked ] = useState(true);
  const [ sf, setSf ] = useState({});
  const [ connected, setConnected ] = useState(true);
  const [ account, setAccount ] = useState(""); // belonging to the client
  const [ fDAI, setfDAI ] = useState({});
  const [ fDAIx, setfDAIx ] = useState({});
  const [ balance, setBalance ] = useState(0);
  const [ pageAddress, setPageAddress ] = useState(""); // belonging to the page
  const [ currentSubscription, setCurrentSubscription ] = useState(0);
  const [ flowInfo, setFlowInfo ] = useState({});
  const [ currentPage, setCurrentPage ] = useState(PAGES.LOADING);
  const [ pageExists, setPageExists ] = useState(false);
  const [ pageData, setPageData ] = useState({});
  const { data, error, isLoading } = useMoralisQuery("Pages", query => { 
    if (web3.utils.isAddress(pageAddress) === true) {
      return query.equalTo("ethAddress", web3.utils.toChecksumAddress(pageAddress)); 
    }
  }, [pageAddress]);

  useEffect(() => {
    if (data !== undefined && data[0] !== undefined && data[0].attributes !== undefined) {
      setPageData(data[0].attributes);
      determineCurrentPage();
    }
  }, [data]);

  useEffect(() => {
    const path = window.location.pathname.slice(1);
    if (web3.utils.isAddress(path) === false && window.location.pathname !== "/") {
      window.location.pathname = "/"; 
    }
    else {
      (async () => {
        await initWeb3();
      })();
    }
  }, []);

  useEffect(() => {
    console.log('account', account);
    if (web3.utils.isAddress(account)) {
      getPageAddress();
      (async () => {
        await getBalance();
      })();
      (async () => {
        await getFlow();
      })();
    }
  }, [account]);

  useEffect(() => {
    determineCurrentPage();
    console.log("YO", account, pageAddress);
  }, [account, pageAddress, connected]);
  
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
      determineCurrentPage();
    }
  }

  const getAccount = async () => {
    console.log("GET ACCOUNT CALLED");
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
        // connect to metamask!
        determineCurrentPage();
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
      setConnected(true);
      setAccount(accts[0]);
      if (window.location.pathname === "/") {
        setPageAddress(accts[0]);
      }
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

  const getPageAddress = () => {
    if (window.location.pathname === "/") {
      setPageAddress(web3.utils.toChecksumAddress(account));
    }
    else {
      setPageAddress(web3.utils.toChecksumAddress(window.location.pathname.slice(1)));
    }
  }
  
  const determineCurrentPage = () => {
    console.log("determine currenct page");
    if (web3.utils.isAddress(account)) {
      if (account !== undefined && pageAddress !== undefined &&
        account.toLowerCase() === pageAddress.toLowerCase()) {
        if (data !== undefined && data[0] !== undefined && data[0].attributes !== undefined) { // enter condition to ensure this page exists
          console.log(data[0].attributes);
          setPageExists(true);
          setCurrentPage(PAGES.USER);
        }
        else {
          setPageExists(false);
          setCurrentPage(PAGES.NOTHING_CREATE);
        }
      }
      else {
        console.log(account, pageAddress);
        setPageExists(false);
        setCurrentPage(PAGES.NOTHING_GO);
      }
    }
    else if (connected === false) {
      setPageExists(false);
      setCurrentPage(PAGES.CONNECT);
    }
  }
  
  const modifyPage = async (username, ethAddress, bio, minSubscription) => {
    const query = new Moralis.Query("Pages");
    const result = await query.equalTo("ethAddress", ethAddress).first(); // f'n works!!!!
    
    if (result === undefined) {
      const newPage = new Moralis.Object.extend("Pages")();
      newPage.set("username", username);
      newPage.set("bio", bio);
      newPage.set("minSubscription", minSubscription);
      await newPage.save();
    }
    else {
      result.set("username", username);
      result.set("bio", bio);
      result.set("minSubscription", minSubscription);
      await result.save();
    }
  }

  const createStream = async streamAmount => {
    await sf.user({
      address: account,
      token: tokens.ropsten.fDAIx
    })
    .flow({
      recipient: pageAddress,
      flowRate: streamAmount.toString()
    })
    .then(() => {
      (async () => {
        await getFlow();
      })();
      console.log("Alpha");
    })
    .catch(() => {
      (async () => {
        await getFlow();
      })();
      console.log("Beta");
    })
  }

  const getFlow = async () => {
    if (account !== "" && pageAddress !== "" && account !== pageAddress) {
      await sf.cfa.getFlow({
        superToken: tokens.ropsten.fDAIx,
        sender: account,
        receiver: pageAddress
      })
      .then(result => {
        setFlowInfo(result);
        setCurrentSubscription(calculateStream(Number(result.flowRate)));
      });
    }
  }

  return (
    <div className="App">
      <StickyHeader balance={balance} getAccount={getAccount} connected={connected} account={account} />
      <CreatorContent 
        createStream={createStream} 
        balance={balance} 
        address={pageAddress} 
        account={account} 
        currentSubscription={currentSubscription}
        flowInfo={flowInfo}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageExists={pageExists}
        determineCurrentPage={determineCurrentPage}
        getPageAddress={getPageAddress}
        modifyPage={modifyPage}
        pageData={pageData}
      />
      <SubscriptionContent unlocked={contentUnlocked} />
    </div>
  );
}

export default App;
