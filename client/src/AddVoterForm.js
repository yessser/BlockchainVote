import React,{useState,useEffect} from 'react'
import {useForm} from 'react-hook-form';

import HDprovider from "@truffle/hdwallet-provider";
import { drizzleReducers } from '@drizzle/store';
import { WebcamCapture} from './components/Webcam/Webcam'
import Home from './components/Home/Home'
const bip39 = require("bip39")
const Web3 = require("web3")
const AddVoterForm = props => {
    const drizzleState =props.drizzleState; 
    const wallet = props.wallet;
    const setWallet = props.setWallet;
    const menomic = props.menomic
    const setMenomic =props.setMenomic;

    const [myImg, setMyImg] = useState("")
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    useEffect(() => {
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
    <div>
    <button onClick={generate}> generation de compte </button>
    {menomic}

    
    <Home wallet={wallet} generate={generate}/>
    </div>
    )
}

export default AddVoterForm
