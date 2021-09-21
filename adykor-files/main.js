

console.log('hello world');

// connection to Moralis Mainnet server
Moralis.initialize("WaGujmZNMBTckf7xuyLhYcbDQxiI18HE95P7jOV5");
Moralis.serverURL = "https://yksyrtftymzt.grandmoralis.com:2053/server";

// TO DO : CHANGE WHEN LIVE
let homepage = "http://127.0.0.1:3000/index.html";

// logged in check
if (Moralis.User.current() == null && window.location.href != homepage) {
    document.querySelector('body').style.display = 'none';
    window.location.href = "index.html";
}

// login function 
login = async () => {
    await Moralis.Web3.authenticate().then(async function (user) {
        console.log('logged in');
        console.log(Moralis.User.current());
        user.set("name", document.getElementById('user-username').value);
        user.set("email", document.getElementById('user-email').value);
        await user.save();

        // TO DO : CHANGE ROUTING SOLUTION WHEN LIVE
        window.location.href = "dashboard.html";
    })
}

// logout function
logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "index.html";
}


// transactions function
// TO DO : CHANGE TO MAINNET TRANSACTIONS WHEN LIVE
// const transactions = await Moralis.Web3API.account.getTransactions();
getTransactions = async () => {
    console.log('get transactions clicked');
    const options = { chain: "rinkeby", address: "0x07F307118f7CAC1934B442a6dc933072B0bFFe38" };
    // const options = { chain: "ropsten", address: "0x07F307118f7CAC1934B442a6dc933072B0bFFe38" };
    const transactions = await Moralis.Web3API.account.getTransactions(options);
    console.log(transactions);

    // table variable
    if (transactions.total > 0) {
        let table = `
        <table class="table">
        <thead>
            <tr>
                <th scope="col">Transaction</th>
                <th scope="col">Block Number</th>
                <th scope="col">Age</th>
                <th scope="col">Type</th>
                <th scope="col">Fee</th>
                <th scope="col">Value</th>
            </tr>
        </thead>
        <tbody id="theTransactions">
        </tbody>
        </table>
        `

        document.querySelector('#tableOfTransactions').innerHTML = table;

        // transactions array
        transactions.result.forEach(t => {
            let content = `
            <tr>
                <td><a href='https://rinkeby.etherscan.io/tx/${t.hash}' target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
                <td><a href='https://rinkeby.etherscan.io/block/${t.block_number}' target="_blank rel="noopener noreferrer">${t.block_number}</a></td>
                <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))}</td>
                <td>${t.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
                <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
                <td>${(t.value / 1e18).toFixed(5)} ETH</td>
            </tr>
            `
            theTransactions.innerHTML += content;
        })
    }
}


// timestamp function for table
// currenttime(ms) - blocktime(ms) = TIME IN MILLISECONDS
// millisecondstoTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))

millisecondsToTime = (ms) => {
    // let minutes = Math.floor(ms / 1000 * 60);
    // let hours = Math.floor(ms / 1000 * 60 * 60);
    // let days = Math.floor(ms / 1000 * 60 * 60 * 24);
    let minutes = (ms / Math.floor(1000 * 60)).toFixed(0);
    let hours = (ms / Math.floor(1000 * 60 * 60)).toFixed(0);
    let days = (ms / Math.floor(1000 * 60 * 60 * 24)).toFixed(0);

    if (days < 1) {
        if (hours < 1) {
            if (minutes < 1) {
                return `less than a minute ago`
            } else return `${minutes} minute(s) ago`
        } else return `${hours} hour(s) ago`
    } else return `${days} day(s) ago`
}




// balances function
getBalances = async () => {
    console.log('Get balances clicked');
    // get BSC native balance for a given address
    const ethBalance = await Moralis.Web3API.account.getNativeBalance();
    const ropstenBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "ropsten" });
    const rinkebyBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "rinkeby" });
    console.log((ethBalance.balance / 1e18).toFixed(5) + " ETH");
    console.log((ropstenBalance.balance / 1e18).toFixed(5) + " ETH");
    console.log((rinkebyBalance.balance / 1e18).toFixed(5) + " ETH");


    // multi-line string template literal
    let content = document.querySelector('#userBalances').innerHTML = `
     <table class="table">
        <thead>
            <tr>
                <th scope="col">Chain</th>
                <th scope="col">Balance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Ether</th>
                <td>${(ethBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
            <tr>
                <th>Ropsten</th>
                <td>${(ropstenBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
            <tr>
                <th>Rinkeby</th>
                <td>${(rinkebyBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
        </tbody>
        </table>
     `
}



// NFTs function
getNFTs = async () => {
    console.log('get nfts clicked');
    let nfts = await Moralis.Web3API.account.getNFTs({ chain: 'rinkeby' });
    console.log(nfts);
    let tableOfNFTs = document.querySelector('#tableOfNFTs');
    if (nfts.result > 0) {
        nfts.result.forEach(n => {
            let metadata = JSON.parse(n.metadata);
            let content = `
            <div class="card col-md-3>
                <img src="${fixURL(metadata.image_url)}" class="card-img-top" alt="..." height=300>
                <div class="card-body">
                    <h5 class="card-title">${metadata.name}</h5>
                    <p class="card-text">${metadata.content}</p>
                </div>
            </div>
            `
            tableOfNFTs.innerHTML += content;
        })
    }
}

// NFT ipfs url conversion function
fixURL = (url) => {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)
    }
    else {
        return url + "?format=json"
    }
}



    // listeners
    if (document.querySelector('#btn-login') != null) {
        document.querySelector('#btn-login').onclick = login;
    }

    if (document.querySelector('#btn-logout') != null) {
        document.querySelector('#btn-logout').onclick = logout;
    }

    if (document.querySelector('#get-transactions-link') != null) {
        document.querySelector('#get-transactions-link').onclick = getTransactions;
    }

    if (document.querySelector('#get-balances-link') != null) {
        document.querySelector('#get-balances-link').onclick = getBalances;
    }

    if (document.querySelector('#get-nfts-link') != null) {
        document.querySelector('#get-nfts-link').onclick = getNFTs;
    }


// get-transactions-link
// get-balances-link
// get-nfts-link
