import React, { useState, useEffect } from 'react';
import { useMoralisQuery } from 'react-moralis';
import { Spinner } from 'react-bootstrap';
import ConnectViaMetaMask from './subcomponents/ConnectViaMetaMask';
import NothingYetCreate from './subcomponents/NothingYetCreate';
import CreatingUser from './subcomponents/CreatingUser';
import CreatedUser from './subcomponents/CreatedUser';

function Home(props) {
    const [ pageAddress, setPageAddress ] = useState("");
    const [ pageCreationMode, setPageCreationMode ] = useState(false);
    const [ username, setUsername ] = useState("");
    const [ bio, setBio ] = useState("");
    const [ minSubscription, setMinSubscription ] = useState(0);

    const { data } = useMoralisQuery("Pages", query => { 
        if (props.web3.utils.isAddress(pageAddress) === true) {
            return query.equalTo("ethAddress", props.web3.utils.toChecksumAddress(pageAddress)); 
        }
    }, [pageAddress]);

    useEffect(() => {
        if (props.web3.utils.isAddress(props.account)) {
            setPageAddress(props.web3.utils.toChecksumAddress(props.account));
        }
    }, []);

    useEffect(() => {
        if (props.web3.utils.isAddress(props.account)) {
            setPageAddress(props.web3.utils.toChecksumAddress(props.account));
        }
    }, [props.account]);

    useEffect(() => {
        if (data !== undefined && data[0] !== undefined && data[0].attributes !== undefined) {
            setUsername(data[0].attributes.username);
            setBio(data[0].attributes.bio);
            setMinSubscription(data[0].attributes.minSubscription);
        }
        else {
            setUsername("");
            setBio("");
            setMinSubscription(0);
        }
    }, [data]);

    const bioCharacterLimit = 300;
    const usernameCharacterLimit = 40;

    const createPage = async (username, ethAddress, bio, minSubscription) => {
        console.log(username, ethAddress, bio, minSubscription);
        if (username !== undefined && 
            username.length > 0 &&
            username.length <= usernameCharacterLimit && 
            bio !== undefined &&
            bio.length <= bioCharacterLimit) {
            await modifyPage(username, ethAddress, bio, minSubscription)
            .then(() => {
                setUsername(username);
                setBio(bio);
                setMinSubscription(minSubscription);
            })
            .catch(e => {
                console.error(e);
            });
        } 
    }

    const modifyPage = async (username, ethAddress, bio, minSubscription) => {
        const query = new props.Moralis.Query("Pages");
        const result = await query.equalTo("ethAddress", ethAddress).first(); // f'n works!!!!
        
        if (result === undefined) {
            let Pages = props.Moralis.Object.extend("Pages");
            const newPage = new Pages(); // fails at this point for some reasn
            newPage.set("username", username);
            newPage.set("bio", bio);
            newPage.set("minSubscription", minSubscription);
            newPage.set("ethAddress", ethAddress);
            await newPage.save();
        }
        else {
            result.set("username", username);
            result.set("bio", bio);
            result.set("minSubscription", minSubscription);
            await result.save();
        }
    }

    return (
        <div>
            {/* props.pageLoading === true ?
            <Spinner animation="border" role="status">
            </Spinner>
            : */
            props.connected === false ?
            <ConnectViaMetaMask />
            :
            username === "" &&
            pageCreationMode === false ?
            <NothingYetCreate 
                address={pageAddress}
                setPageCreationMode={setPageCreationMode}
            />
            :
            username === "" ?
            <CreatingUser
                address={pageAddress}
                setPageCreationMode={setPageCreationMode}
                createPage={createPage}
                usernameCharacterLimit={usernameCharacterLimit}
                bioCharacterLimit={bioCharacterLimit}
            />
            :
            <CreatedUser 
                address={pageAddress}
                modifyPage={modifyPage}
                username={username}
                bio={bio}
                minSubscription={minSubscription}
                pageCreationMode={pageCreationMode}
                setPageCreationMode={setPageCreationMode}
                usernameCharacterLimit={usernameCharacterLimit}
                bioCharacterLimit={bioCharacterLimit}
            />
            }
        </div>
    )
}

export default Home;
