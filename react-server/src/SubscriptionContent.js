import React from 'react';
import { Card } from 'antd';

function SubscriptionContent(props) {
    if (props.unlocked) {
        return (
            <div>
                <Card className="SubscriptionContent" bordered={true}>
                    <p>
                        Some important content
                    </p>
                </Card>
            </div>
        )
    }
    else {
        return <></>
    }
}

export default SubscriptionContent
