import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

function StickyHeader(props) {
    const enableWallet = async () => {
        window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        await props.getAccount();
    }

    return (
        <div className="StickyHeader">
            <Navbar>
                <Navbar.Brand className="brand">
                    <h2>
                        Dycentra
                    </h2>
                </Navbar.Brand>
                {(props.balance > 0) ? 
                <NavbarCollapse className="justify-content-end" style={{"display" : "none !important"}}>
                    <a href="https://app.superfluid.finance/dashboard" target="_blank" rel="noreferrer">
                        DAIx balance: 
                    </a>
                    &nbsp;
                    ${props.balance.toFixed(2)}
                </NavbarCollapse>
                :
                <></>
                }
                    
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
