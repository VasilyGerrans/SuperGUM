import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import AutosizeInput from 'react-input-autosize';

function CreatedUser(props) {
    const [ balance, setBalance ] = useState(0);
    const [ perSecond, setPerSecond ] = useState(0);

    const [ username, setUsername ] = useState("John Wick");
    const [ bio, setBio ] = useState("My name is John Wick, and I am a professional poet, storyteller, narrative-explorer, and rhymer-extraordinaire. Come and join me on my epic crypto journey as I fight to see just how long a mildly amusing Lorem Ipsum substitute can drag on before it's no longer amusing enough to keep writing.");
   
    const [ _username, _setUsername ] = useState("John Wick");
    const [ _bio, _setBio ] = useState("My name is John Wick, and I am a professional poet, storyteller, narrative-explorer, and rhymer-extraordinaire. Come and join me on my epic crypto journey as I fight to see just how long a mildly amusing Lorem Ipsum substitute can drag on before it's no longer amusing enough to keep writing.");
    
    const [ processingSF, setProcessingSF ] = useState(false);
    const [ _minSubscription, _setMinSubscription ] = useState(5);
    const [ minSubscription, setMinSubscription ] = useState(5);
    const [ warningMsg, setWarningMsg ] = useState("");
    const [ editBioMode, setEditBioMode ] = useState(false);
    const [ editFlowMode, setEditFlowMode ] = useState(false);
    
    const bioCharacterLimit = 300;
    const usernameCharacterLimit = 40;


    const onBioChange = e => {
        console.log(e.target.value.length);
        if (e.target.value.length <= bioCharacterLimit) {
            setBio(e.target.value);
        }
    }

    const onUsernameChange = e => {
        console.log(e.target.value.length);
        if (e.target.value.length <= usernameCharacterLimit) {
            setUsername(e.target.value);
        }
    }

    const onSubChange = e => {
        setMinSubscription(e.target.value);
    }

    return ( // add a little clipboard copy thing next to the address later
        <div>
            <div className="CreatedUser">  
                <div
                    style={{
                        "display": "flex", 
                        "justifyContent": "space-between",
                        "alignItems": "center"
                    }}
                >
                    {editBioMode === false ? 
                    <h1><b>{username}</b></h1>            
                    :
                    <div
                        style={{
                            position: "relative"
                        }}
                    >
                        <h1>
                            <AutosizeInput
                                className="name-input"
                                type="text" 
                                placeholder={_username} 
                                value={username} 
                                onChange={onUsernameChange}
                                inputStyle={{
                                    fontWeight: "bold",
                                    padding: "0px"
                                }}
                            />
                        </h1>
                        <span className="new-tooltip" style={{                            
                            left: "-160px",
                            top: "7px"
                        }}>
                            {username.length} / {usernameCharacterLimit}
                        </span>
                    </div>
                    }
                    {editBioMode === false ?
                    <div>
                        <Button onClick={() => {setEditBioMode(true)}}>
                            Edit
                        </Button>
                    </div>
                    :
                    <div>
                        <Button onClick={() => {
                            if (username.length > 0) {
                                _setUsername(username.trim());
                            }
                            else {
                                setUsername(_username.trim());
                            }
                            _setBio(bio.trim());
                            setUsername(username.trim());
                            setBio(bio.trim());
                            setEditBioMode(false);
                        }}>
                            Save
                        </Button>
                        <Button onClick={() => {
                            setUsername(_username);
                            setBio(_bio);
                            setEditBioMode(false);
                        }}>
                            Cancel
                        </Button>
                    </div>
                    } 
                </div>                   
                <p className="account-highlight">{props.address}</p>
                <div className="bio-window">
                    {editBioMode === false ?
                    <p>
                        {bio}
                    </p>
                    :
                    <div style={{
                        position: "relative",
                        width: "100%"
                    }}>
                        <textarea 
                            onChange={onBioChange} 
                            value={bio} 
                            rows="3"
                            style={{
                                margin: "0px", 
                                padding: "0px"
                            }}
                        >
                        </textarea>
                        <span className="new-tooltip" style={{
                            left: "-160px",
                            top: "19px"
                        }}>
                            {bio.length} / {bioCharacterLimit}
                        </span>
                    </div>
                    }
                </div>  
            </div>
            <div>
                <hr />
                <div 
                    className="CreatedUser" 
                    style={{
                        "display": "flex", 
                        "justifyContent": "space-between",
                        "alignItems": "center",
                        "margin": "20px 0px"
                    }}
                >
                    <div>
                        Minimum subscription: 
                        {editFlowMode === false ?
                        <b> {_minSubscription} DAIx/month</b>
                        :
                        <b> <Input 
                                value={minSubscription}
                                type="number"
                                onChange={onSubChange}
                                min={0}   
                                step={0.01}                             
                            >
                            </Input> DAIx/month</b>
                        }
                    </div>
                    <div>
                        {editFlowMode === false ?
                        <Button onClick={() => {setEditFlowMode(!editFlowMode)}}>
                            Change
                        </Button>
                        :
                        <div>
                            <Button className="confirm-button" onClick={() => {
                                _setMinSubscription(minSubscription);
                                setEditFlowMode(false);
                            }}>
                                Confirm
                            </Button>
                            <Button onClick={() => {
                                setMinSubscription(_minSubscription);
                                setEditFlowMode(false);
                            }}>
                                Back
                            </Button>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatedUser;
