import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import BigNumber from 'bignumber.js';
import Logo from './images/logo.png';

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
                <Navbar.Brand className="brand" style={{
                    display: "inline-flex",
                    alignItems: "center"
                }}>
                    <img src={Logo} alt="" height="50" />
                    <h2 style={{
                        margin: "0px"
                    }}>
                        SuperGUM
                    </h2>
                </Navbar.Brand>
                {(props.balance > 0) ? 
                <NavbarCollapse className="justify-content-end" style={{"display" : "none !important"}}>
                    DAIx balance: 
                    &nbsp;
                    <a href="https://app.superfluid.finance/dashboard" target="_blank" rel="noreferrer">
                        {BigNumber(props.balance).shiftedBy(-18).toFixed(3).toString()}
                    </a>
                </NavbarCollapse>
                :
                <NavbarCollapse className="justify-content-end" style={{"display" : "none !important"}}>
                    <a href="https://app.superfluid.finance/dashboard" target="_blank" rel="noreferrer">
                        Get DAIx
                    </a>
                </NavbarCollapse>
                }
                    
                <Navbar.Collapse className="justify-content-end">
                    {(props.connected === false || props.account === "" || props.account === undefined) ? 
                        <Button onClick={enableWallet}>
                            Connect wallet
                        </Button>
                    :
                        <Button onClick={() => {
                            props.history.push("/");
                        }}>
                            {props.account.toString().substring(0, 4)}...{props.account.toString().substring(38)}
                        </Button>
                    }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default StickyHeader;
