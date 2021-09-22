import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';

function StickyHeader(props) {


    return (
        <div className="StickyHeader">
            <Navbar>
                <Navbar.Brand className="brand">
                    <h2>
                        Dycentra
                    </h2>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Button onClick={() => {props.walletButton()}}>
                        Connect wallet
                    </Button>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default StickyHeader;
