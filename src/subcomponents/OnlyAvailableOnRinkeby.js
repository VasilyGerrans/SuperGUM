import React from 'react';
import { Card } from 'antd';
import Smugness from '../images/smugasuka.jpg';

function OnlyAvailableOnRinkeby() {
    return (
        <div>
            <Card className="CreatorContent">
                <h1>Whoopsie!</h1>
                <img width="300" src={Smugness} alt="a smug face intended to mock your technical ineptitude" style={{
                    margin: "30px"
                }}/>
                <h2>
                    Looks like you are not connected to the Rinkeby testnet.
                </h2>
                <p>
                    Switch now or expect things to get very confusing very fast.
                </p>
            </Card>
        </div>
    )
}

export default OnlyAvailableOnRinkeby;