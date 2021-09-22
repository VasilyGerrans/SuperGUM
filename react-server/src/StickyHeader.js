import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';

function StickyHeader(props) {
    const enableWallet = async () => {
        window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        console.log("toggled");

        await props.getAccount();

        console.log(props.account);
    }

    return (
        <div className="StickyHeader">
            <Navbar>
                <Navbar.Brand className="brand">
                    <h2>
                        Dycentra
                    </h2>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {(props.connected === false || props.account === "" || props.account === undefined) ? 
                        <Button onClick={enableWallet}>
                            Connect wallet
                        </Button>
                    :
                        <Button>
                            {props.account.toString().substring(0, 4)}...{props.account.toString().substring(38)}
                        </Button>
                    }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default StickyHeader;
