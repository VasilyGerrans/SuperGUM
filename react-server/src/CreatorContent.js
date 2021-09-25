import React from 'react';
import { Card } from 'antd';
import ExperimentalSuperfluid from './ExperimentalSuperfluid';

function CreatorContent(props) {
    return (
        <div>
            <Card className="CreatorContent" bordered={true}>
                <ExperimentalSuperfluid createStream={props.createStream} balance={props.balance} address={props.address} />
            </Card>
        </div>
    )
}

export default CreatorContent;
