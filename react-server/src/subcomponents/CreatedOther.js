import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { calculateFlowRate } from '../config';
import BigNumber from 'bignumber.js';
import { Spinner } from 'react-bootstrap';
import AddressDisplay from './AddressDisplay';

function CreatedOther(props) {
    const [ balance, setBalance ] = useState(0);
    const [ perSecond, setPerSecond ] = useState(0);

    const [ editMode, setEditMode ] = useState(false);
    const [ subscriptionNumber, setSubscriptionNumber ] = useState(0);
    const [ _subscriptionNumber, _setSubscriptionNumber ] = useState(0);
    const [ processingSF, setProcessingSF ] = useState(false);
    const [ minSubscription, setMinSubscription ] = useState(0);
    const [ _minSubscription, _setMinSubscription ] = useState(0);
    const [ warningMsg, setWarningMsg ] = useState("");

    useEffect(() => {
        if (props.flowInfo !== undefined && 
        props.flowInfo.timestamp !== undefined &&
        props.flowInfo.flowRate !== undefined) {
            setBalance(BigNumber(((Date.now() - props.flowInfo.timestamp) * Number(props.flowInfo.flowRate)) / 1000).shiftedBy(-18).toFixed(8).toString());
        }
    }, []);

    useEffect(() => {
        if (Object.entries(props.flowInfo).length > 0) {
            if (Object.entries(props.flowInfo).length > 0) {
                setProcessingSF(false);
                const interval = setInterval(intervalCall, 1000);
                return () => {
                    clearInterval(interval);
                }
            }
        }
    }, [props.flowInfo]);

    useEffect(() => {
        if (props.currentSubscription > 0) {
            setSubscriptionNumber(props.currentSubscription);
            _setSubscriptionNumber(props.currentSubscription);
            setPerSecond(BigNumber(calculateFlowRate(BigNumber(props.currentSubscription)
            .shiftedBy(18))));
        }
    }, [props.currentSubscription])

    useEffect(() => {
        _setMinSubscription(props.minSubscription);
    }, [props.minSubscription]);

    const intervalCall = () => {
        setBalance(BigNumber(((Date.now() - props.flowInfo.timestamp) * Number(props.flowInfo.flowRate)) / 1000).shiftedBy(-18).toFixed(8).toString());
    }

    const onChange = e => {
        if (e.target.value >= 0) {
            setSubscriptionNumber(e.target.value);

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

                if (num < _minSubscription && warningMsg === "") {
                    setWarningMsg(`Warning: You have specified a subscription amount less than the creator's minimum (${_minSubscription.toFixed(2).toString()} DAIx/month). You will not gain access to subscription content.`);
                }
                else if (num >= _minSubscription) {
                    setWarningMsg("");
                }
            } 
        }
    }

    const onChangeMin = e => {
        if (e.target.value >= 0) {
            setMinSubscription(e.target.value);

            const num = Number(e.target.value);
            if (num > 0) {
                setPerSecond(BigNumber(calculateFlowRate(BigNumber(num)
                .shiftedBy(18))));
            }
            else {
                setPerSecond(0);
            }

            if (num < _minSubscription && warningMsg === "") {
                setWarningMsg(`Warning: You have specified a subscription amount less than the creator's minimum (${_minSubscription.toFixed(2).toString()} DAIx/month). You will not gain access to subscription content.`);
            }
            else if (num >= _minSubscription) {
                setWarningMsg("");
            }
        }
    }

    return (
        <div>
            <div className="CreatedOther">                         
                <h1><b>{props.username}</b></h1>
                <AddressDisplay
                    address={props.address}
                />
                <div className="bio-window">
                    <p>
                        {props.bio}
                    </p>
                </div>                
            </div>
            {props.currentSubscription > 0 ?
            <div>
                <hr />
                <div 
                    className="CreatedOther" 
                    style={{
                        "display":"flex", 
                        "justifyContent": "space-between",
                        "alignItems": "center",
                        "margin": "20px 0px"
                    }
                }>
                    <div>
                        {editMode === false ?
                        <div>
                            Current subscription: <b>{props.currentSubscription} DAIx/month</b>
                        </div>
                        :
                        <div>
                            Current subscription: <b><input type="number" step="0.01" placeholder={_subscriptionNumber} value={subscriptionNumber} onChange={onChange} /> DAIx/month</b>
                        </div>
                        } 
                    </div>
                    <div>
                        {processingSF === true ?
                        <Spinner animation="grow" role="status">
                        </Spinner>   
                        :
                        editMode === false ?
                        <div>
                            <Button onClick={() => {
                                setEditMode(true);                                
                            }}>
                                Change  
                            </Button>
                        </div>
                        :
                        <div>
                            <Button className="confirm-button" onClick={() => {
                                if (props.currentSubscription !== subscriptionNumber) {
                                    props.createStream(perSecond);
                                    setEditMode(false);
                                    setProcessingSF(true);
                                }
                                else {
                                    setEditMode(false)
                                    setSubscriptionNumber(props.currentSubscription);
                                    setPerSecond(BigNumber(calculateFlowRate(BigNumber(props.currentSubscription)
                                    .shiftedBy(18))));
                                }
                            }}>
                                Confirm  
                            </Button>
                            <Button className="cancel-button" onClick={() => {
                                props.createStream(0);
                                setEditMode(false);
                                setProcessingSF(true);
                            }}>
                                Cancel  
                            </Button>
                            <Button onClick={() => {
                                setEditMode(false)
                                setSubscriptionNumber(props.currentSubscription);
                                setPerSecond(BigNumber(calculateFlowRate(BigNumber(props.currentSubscription)
                                .shiftedBy(18))));
                            }}>
                                Back
                            </Button>
                        </div>
                        }
                    </div>
                </div>
                {editMode === false ?
                balance > 0 ?
                <h1>
                    <b>
                        {balance} DAIx paid
                    </b>
                </h1>
                :
                <div>
                </div>
                :
                <div>
                    <h3>
                        {BigNumber(perSecond)
                        .shiftedBy(-18)
                        .toFixed(8)
                        .toString()}
                    </h3>
                    <p>DAIx per second</p>
                </div>
                }
            </div>
            :
            editMode === false ? 
                <div>
                    <br />
                    <Button onClick={() => {
                        setPerSecond(BigNumber(calculateFlowRate(BigNumber(_minSubscription)
                        .shiftedBy(18))));
                        setMinSubscription(_minSubscription);
                        setEditMode(true)
                    }}>
                        {_minSubscription === 0 ? 
                        <span>Donate</span>
                        :
                        <span>View content</span>
                        }
                    </Button>
                </div>
            :
                <div>
                    <hr />
                    <div 
                        className="CreatedOther" 
                        style={{
                            "display":"flex", 
                            "justifyContent": "space-between",
                            "alignItems": "center",
                            "margin": "20px 0px"
                        }
                    }>
                        <div>
                            Name a fair price: <b><input type="number" step="0.01" placeholder={_minSubscription} value={minSubscription} onChange={onChangeMin} /> DAIx/month</b>
                        </div>
                        <div>
                            <Button className="confirm-button" onClick={() => {    
                                props.createStream(perSecond);
                                setEditMode(false);
                                setProcessingSF(true);                             
                            }}>
                                {_minSubscription === 0 ?
                                <span>Donate</span>
                                :
                                <span>Subscribe</span>
                                }
                            </Button>
                            <Button className="cancel-button" onClick={() => {                            
                                setEditMode(false);  
                                setWarningMsg("");                              
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h3>
                            {BigNumber(perSecond)
                            .shiftedBy(-18)
                            .toFixed(8)
                            .toString()}
                        </h3>
                        <p>DAIx per second</p>
                    </div>
                </div>
            }
            {warningMsg.length > 0 ?
                <div className="warning-message">
                    {warningMsg}
                </div>
            :
                <>
                </>
            }
        </div>
    )
}

export default CreatedOther;
