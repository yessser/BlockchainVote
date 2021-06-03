import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import drizzle functions and contract artifact
import { Drizzle,generateStore} from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";

import MyStringStore from "./contracts/MyStringStore.json";
import BallotBox from './contracts/BallotBox.json'

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [MyStringStore,BallotBox],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545",
    },
  
  },
};

const drizzleStore = generateStore(options)
// setup drizzle
const drizzle = new Drizzle(options,drizzleStore);

ReactDOM.render(
<DrizzleContext.Provider drizzle={drizzle}>
<App />
</DrizzleContext.Provider>, document.getElementById('root'));
