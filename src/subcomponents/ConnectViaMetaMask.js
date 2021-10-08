import { Button } from 'antd';
import React from 'react';
import MetaMaskLogo from '../images/metamask.png';

function ConnectViaMetaMask() {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "30px 300px 40px"
        }}>
            <h1><b>Connect via MetaMask</b></h1>
            <img 
                src={MetaMaskLogo} 
                alt="" 
                width="500"
                style={{
                    margin: "auto"
                }}
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
