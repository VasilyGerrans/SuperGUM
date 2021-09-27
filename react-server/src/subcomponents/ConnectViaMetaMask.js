import { Button } from 'antd';
import React from 'react';
import MetaMaskLogo from '../images/metamask.png';

function ConnectViaMetaMask() {
    return (
        <div>
            <h1><b>Connect via MetaMask</b></h1>
            <img 
                src={MetaMaskLogo} 
                alt="" 
                width="500"
            />
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                <Button>
                    Download MetaMask
                </Button>
            </a>
        </div>
    )
}

export default ConnectViaMetaMask
