import React from 'react';
import { Card } from 'antd';
import ExperimentalSuperfluid from './ExperimentalSuperfluid';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import NothingYetCreate from './subcomponents/NothingYetCreate';
import NothingYetGo from './subcomponents/NothingYetGo';
import CreatedOther from './subcomponents/CreatedOther';
import CreatedUser from './subcomponents/CreatedUser';

function CreatorContent(props) {
    return (
        <div>
            <Card className="CreatorContent" bordered={true}>
                {/* <ExperimentalSuperfluid 
                    createStream={props.createStream} 
                    balance={props.balance} 
                    address={props.address} 
                    account={props.account}
                    currentSubscription={props.currentSubscription}
                    flowInfo={props.flowInfo}
                /> */}
                {/* <ConnectViaMetaMask /> */}
                {/* <NothingYetCreate 
                    address={props.address}
                /> */}
                {/* <NothingYetGo 
                    address={props.address}
                /> */}
                {/* <CreatedOther 
                    createStream={props.createStream} 
                    balance={props.balance} 
                    address={props.address} 
                    account={props.account}
                    currentSubscription={props.currentSubscription}
                    flowInfo={props.flowInfo}
                /> */}
                {/* <CreatedUser
                    address={props.address}
                /> */}
            </Card>
        </div>
    )
}

export default CreatorContent;
