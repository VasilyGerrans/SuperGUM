import { Button } from 'antd';
import React from 'react';
import EmptyBox from '../images/emptybox.png';
import AddressDisplay from './AddressDisplay';

function NothingYetGo(props) {
    return (
        <div>
            <h1><b>There is no page here yet</b></h1>
            <AddressDisplay 
                address={props.address}  
                justifyCenter={true}              
            />
            <p>
                <img src={EmptyBox} alt="" height="200" />
            </p>
            <Button onClick={() => {
                props.history.push("/");
            }}>
                Go to my page
            </Button>
        </div>
    )
}

export default NothingYetGo;
