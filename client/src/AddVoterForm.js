import React,{useState,useEffect} from 'react'
import {useForm} from 'react-hook-form';
import "./index.css"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";


import HDprovider from "@truffle/hdwallet-provider";
import { drizzleReducers } from '@drizzle/store';
import { WebcamCapture} from './components/Webcam/Webcam'
import Home from './components/Home/Home'
import ChoiceForm  from "./ChoiceForm";
import Resultat from './components/Resulat';
const bip39 = require("bip39")
const Web3 = require("web3")
const AddVoterForm = props => {
    const drizzleState =props.drizzleState; 
    const wallet = props.wallet;
    const onSubmit = props.onSubmit
    const setWallet = props.setWallet;
    const menomic = props.menomic
    const setMenomic =props.setMenomic;
    let { path, url } = useRouteMatch();
    
    useEffect(() => {
        console.log("render");
        generate()
    }, [])
    const generate = ()=>{
        const mnemonic = bip39.generateMnemonic()
        setMenomic(mnemonic)
        const pro = new  HDprovider({
            mnemonic:{
                phrase:mnemonic
            },
            providerOrUrl: "http://localhost:7545"
            
        })

        setWallet(new Web3(pro));
        const web3 = new Web3(pro);
        console.log(web3);    
    }
    return (
    <Switch>
    <Route path={url}>
        <Home onSubmit={onSubmit} wallet={wallet} generate={generate}/>
    </Route>
    <Route path={"resultat"}>
        <div className="topnav">
            <Link to={url}>voter</Link>
            <Link to={"resultat"}>Resultat</Link>
        </div>
        <Resultat/>
    </Route>
    </Switch>
    )
}

export default AddVoterForm
