import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import AutosizeInput from 'react-input-autosize';

function CreatedUser(props) {
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
   
    const [ _username, _setUsername ] = useState("");
    const [ _bio, _setBio ] = useState("");
    
    const [ _minSubscription, _setMinSubscription ] = useState(0);
    const [ minSubscription, setMinSubscription ] = useState(0);
    const [ editBioMode, setEditBioMode ] = useState(false);
    const [ editFlowMode, setEditFlowMode ] = useState(false);

    useEffect(() => {
        return () => {
            reset();
        }
    }, []);

    useEffect(() => {
        if (props !== undefined) {
            if (props.username !== undefined) {
                setUsername(props.username);
                _setUsername(props.username);
            }
            if (props.bio !== undefined) {
                setBio(props.bio);
                _setBio(props.bio);
            }
            if (props.minSubscription !== undefined) {
                setMinSubscription(props.minSubscription);
                _setMinSubscription(props.minSubscription);
            }
        }
    }, [props.username, props.bio, props.minSubscription]);

    const reset = () => {
        setUsername("");
        _setUsername("");
        setBio("");
        _setBio("");
        setMinSubscription(0);
        _setMinSubscription(0);
    }

    const save = () => {
        (async () => props.modifyPage(username, props.address, bio, Number(minSubscription)))();
    }

    const onBioChange = e => {
        if (e.target.value.length <= props.bioCharacterLimit) {
            setBio(e.target.value);
        }
    }

    const onUsernameChange = e => {
        if (e.target.value.length <= props.usernameCharacterLimit) {
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
                                placeholder={_username.length > 0 ? _username : "Username"} 
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
                            {username.length} / {props.usernameCharacterLimit}
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
                            save();
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
                            style={{
                                margin: "0px", 
                                padding: "0px"
                            }}
                            placeholder="Bio"
                        >
                        </textarea>
                        <span className="new-tooltip" style={{
                            left: "-160px",
                            top: "19px"
                        }}>
                            {bio.length} / {props.bioCharacterLimit}
                        </span>
                    </div>
                    }
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
                                    save();
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
        </div>
    )
}

export default CreatedUser;
