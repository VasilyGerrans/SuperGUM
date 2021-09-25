import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Input } from 'antd';
import { calculateStreamPerSecond } from './config';

function ExperimentalSuperfluid(props) {
    const [ balance, setBalance ] = useState(0);

    useEffect(() => {
        loadBalance();
        return () => {
            clearInterval(loadBalance());
        }
    }, []);

    const loadBalance = () => {
        console.log(props);
        if (Number(props.balance) > 0) {
            setBalance(props.balance);
            setInterval(() => {
                setBalance((Number(balance) + (calculateStreamPerSecond(props.outflows) / 10)).toFixed(5));
            }, 
            100);
        }
    }

    return (
        <div>
            <h1>Experimental Superfluid</h1>
            <br />
            <p className="account-highlight">{props.address}</p>
            <br />
            <Input placeholder='Enter DAIx amount' /> / month            
            <br />
            <br />
            <Button onClick={props.createStream}>
                Subscribe
            </Button>
        </div>
    )
}

export default ExperimentalSuperfluid;
