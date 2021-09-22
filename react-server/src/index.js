import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MoralisProvider } from 'react-moralis';
import { moralisLoginData } from './config';

ReactDOM.render(
  <MoralisProvider 
    appId={moralisLoginData.gerrans.appId} 
    serverUrl={moralisLoginData.gerrans.serverUrl}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MoralisProvider>
  , document.getElementById('root')
);
