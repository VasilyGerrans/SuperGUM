import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Input } from 'antd';
import { calculateFlowRate } from './config';
import BigNumber from 'bignumber.js';

function ExperimentalSuperfluid(props) {
    const [ balance, setBalance ] = useState(0);
    const [ inputField, setInputField ] = useState("");
    const [ perSecond, setPerSecond ] = useState(0);

    var loaded = false;

    useEffect(() => {
        if (loaded === false && Object.entries(props.flowInfo).length > 0) {
            loaded = true;
            loadBalance();
            return () => {
                clearInterval(loadBalance());
            }
        }
    }, [props.flowInfo]);

    const loadBalance = () => {
        if (Object.entries(props.flowInfo).length > 0) {
            setInterval(() => {
                setBalance(BigNumber(((Date.now() - props.flowInfo.timestamp) * Number(props.flowInfo.flowRate)) / 1000).shiftedBy(-18).toFixed(8).toString())
            }, 
            1000);
        }
    }

    const onChange = e => {
        if (e.target.value >= 0) {
            setInputField(e.target.value);
    
            if (e.target.value === "") {
                setPerSecond(0);
            }
            else {
                const num = Number(e.target.value);
                if (num > 0) {
                    setPerSecond(BigNumber(calculateFlowRate(BigNumber(num)
                    .shiftedBy(18))));
                }
                else {
                    setPerSecond(0);
                }
            } 
        }
    }

    return (
        <div>
            <h1>Experimental Superfluid</h1>
            <br />
            <p className="account-highlight">{props.address}</p>
            <Input 
                type="number"
                value={inputField} 
                onChange={onChange} 
                placeholder='0.00 DAIx' 
                /> /month            
            <br />
            <br />
            {perSecond === 0 ?
                <></>
                :
                <div>
                    <h3>
                        {BigNumber(perSecond)
                        .shiftedBy(-18)
                        .toFixed(8)
                        .toString()}
                    </h3>
                    <p>per second</p>
                </div>
            }

            <Button onClick={() => {props.createStream(perSecond)}}>
                Subscribe
            </Button>
            {props.currentSubscription > 0 ?
                <div>
                    <hr />
                    <p>
                        Current subscription: {props.currentSubscription} DAIx/month
                    </p>
                    {balance > 0 ?
                    <h1>
                        <b>
                            {balance} DAIx paid
                        </b>
                    </h1>
                    :
                    <div>
                    </div>
                    }
                </div>
            :
                <br />
            }
        </div>
    )
}

export default ExperimentalSuperfluid;
