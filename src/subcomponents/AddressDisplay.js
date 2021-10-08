import React, { useEffect, useState } from 'react';
import Etherscan from '../images/etherscan.png';

function AddressDisplay(props) {
    const [ justification, setJustification ] = useState("left");
    useEffect(() => {
        if (props.justifyCenter === true) {
            setJustification("center");
        }
        else {
            setJustification("left");
        }
    }, [props.justifyCenter]);

    return (
        <div style={{
            display: "flex",
            justifyContent: justification,
            alignItems: "center"
        }}>
            <p className="account-highlight" style={{margin: "0px"}}>
                {props.address}
            </p>
            &nbsp;
            <a href={"https://rinkeby.etherscan.io/address/" + props.address} target="_blank" rel="noreferrer">
                <img src={Etherscan} width="15px" height="15px" alt="view in Etherscan"/>
            </a>
        </div>
    )
}

export default AddressDisplay;
