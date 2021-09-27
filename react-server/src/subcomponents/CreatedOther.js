import React, { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { calculateFlowRate } from '../config';
import BigNumber from 'bignumber.js';

function CreatedOther(props) {
    const [ balance, setBalance ] = useState(0);
    const [ inputField, setInputField ] = useState("");
    const [ perSecond, setPerSecond ] = useState(0);

    const [ username, setUsername ] = useState("John Wick");
    const [ bio, setBio ] = useState("My name is John Wick, and I am a professional poet, storyteller, narrative-explorer, and rhymer-extraordinaire. Come and join me on my epic crypto journey as I fight to see just how long a mildly amusing Lorem Ipsum substitute can drag on before it's no longer amusing enough to keep writing.");
    const [ editMode, setEditMode ] = useState(false);
    const [ subscriptionNumber, setSubscriptionNumber ] = useState(0);

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

    useEffect(() => {
        if (props.currentSubscription > 0) {
            setSubscriptionNumber(props.currentSubscription);
        }
    }, [props.currentSubscription])

    const loadBalance = () => {
        if (Object.entries(props.flowInfo).length > 0) {
            setInterval(() => {
                setBalance(BigNumber(((Date.now() - props.flowInfo.timestamp) * Number(props.flowInfo.flowRate)) / 1000).shiftedBy(-18).toFixed(8).toString())
            }, 
            1000);
        }
    }

    const onChange = e => {
        console.log('called on change');
        if (e.target.value >= 0) {
            setSubscriptionNumber(e.target.value);
        }
    }

    return ( // add a little clipboard copy thing next to the address later
        <div>
            <div className="CreatedOther">
                <h1><b>{username}</b></h1>
                <p className="account-highlight">{props.address}</p>
                <div className="bio-window">
                    <p>
                        {bio}
                    </p>
                </div>
                {/* <Input 
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
                </Button> */}
            </div>
            {props.currentSubscription > 0 ?
                <div>
                    <hr />
                    <div 
                        className="CreatedOther" 
                        style={
                            {"display":"flex", 
                            "justifyContent": "space-between",
                            "alignItems": "center",
                            "margin": "20px 0px"
                            }}>
                        <div>
                            {editMode === false ?
                            <div>
                                Current subscription: <b>{props.currentSubscription} DAIx/month</b>
                            </div>
                            :
                            <div>
                                Current subscription: <b><input type="number" step="0.05" placeholder={props.currentSubscription} value={subscriptionNumber} onChange={onChange} /> DAIx/month</b>
                            </div>
                            } 
                        </div>
                        <div>
                            {editMode === false ?
                            <Button onClick={() => {setEditMode(true)}}>
                                Change  
                            </Button>
                            :
                            <div>
                                <Button className="confirm-button" onClick={() => {setEditMode(!editMode)}}>
                                    Confirm  
                                </Button>
                                <Button className="cancel-button" onClick={() => {
                                    setEditMode(false)
                                    setSubscriptionNumber(props.currentSubscription);
                                }}>
                                    Cancel  
                                </Button>
                            </div>
                            }
                        </div>
                    </div>
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

export default CreatedOther;
