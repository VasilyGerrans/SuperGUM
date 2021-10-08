import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import BigNumber from 'bignumber.js';
import Logo from './images/logo.png';

function StickyHeader(props) {
    const [ balance, setBalance ] = useState(BigNumber(0));

    useEffect(() => {
        if (props.balance !== undefined && props.netFlow !== undefined) {
            const interval = setInterval(intervalCall, 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [props.balance, props.netFlow]);

    const enableWallet = async () => {
        window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        await props.getAccount();
    }

    const intervalCall = () => {
        setBalance(BigNumber(props.balance + ((Date.now() - props.startingTime) / 1000 * props.netFlow)));
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
                {(balance > 0) ? 
                <NavbarCollapse className="justify-content-end" style={{"display" : "none !important"}}>
                    <a href="https://app.superfluid.finance/dashboard" target="_blank" rel="noreferrer">
                        Balance
                    </a>                    
                    :&nbsp;
                    {balance.shiftedBy(-18).toFixed(3).toString()} DAIx
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
