import { Button } from 'antd';
import React from 'react';
import EmptyBox from '../images/emptybox.png';
import AddressDisplay from './AddressDisplay';

function NothingYetCreate(props) {
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
                props.setPageCreationMode(true);
            }}>
                Create
            </Button>
        </div>
    )
}

export default NothingYetCreate;
