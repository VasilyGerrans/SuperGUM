import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Input } from 'antd';
import { calculateStreamPerSecond, calculateFlowRate } from './config';
import BigNumber from 'bignumber.js';

function ExperimentalSuperfluid(props) {
    const [ balance, setBalance ] = useState(0);
    const [ inputField, setInputField ] = useState("");
    const [ perSecond, setPerSecond ] = useState(0);

    useEffect(() => {
        loadBalance();
        return () => {
            clearInterval(loadBalance());
        }
    }, []);

    const loadBalance = () => {
        if (Number(props.balance) > 0) {
            setBalance(props.balance);
            setInterval(() => {
                setBalance((Number(balance) + (calculateStreamPerSecond(props.outflows) / 10)).toFixed(5));
            }, 
            100);
        }
    }

    const processSubscribe = () => {

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
            <br />
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
        </div>
    )
}

export default ExperimentalSuperfluid;
