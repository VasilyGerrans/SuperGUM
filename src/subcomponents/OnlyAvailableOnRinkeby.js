import React from 'react';
import { Card } from 'antd';
import GigaChad from '../images/gigachad.jpg';

function OnlyAvailableOnRinkeby() {
    return (
        <div>
            <Card className="CreatorContent">
                <h1><b>YES</b></h1>
                <img width="400" src={GigaChad} alt="smiling face intended to inspire awe in the visitor" style={{
                    margin: "30px",
                    marginTop: "10px"
                }}/>
                <h2>
                    I did only build this app for the <span className="rinkeby-highlight">Rinkeby</span> testnet. How could you tell?
                </h2>
                <p>
                    (Click the MetaMask button on the top right and change the network to <b>Rinkeby</b>.)
                </p>
            </Card>
        </div>
    )
}

export default OnlyAvailableOnRinkeby;