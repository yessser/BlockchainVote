import React,{} from 'react'
import {useForm} from 'react-hook-form';

import HDprovider from "@truffle/hdwallet-provider";
const bip39 = require("bip39")
const Web3 = require("web3")
const AddVoterForm = props => {
    const wallet = props.wallet;
    const setWallet = props.setWallet;
    const menomic = props.menomic
    const setMenomic =props.setMenomic;

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => {
        
        
    }
    
    
    const generate = ()=>{
        const mnemonic = bip39.generateMnemonic()
        setMenomic(mnemonic)
        const pro = new  HDprovider({
            mnemonic:{
                phrase:mnemonic
            },
            providerOrUrl: "http://localhost:7545"
            
        })
        setWallet(pro);
        const web3 = new Web3(pro);
        console.log(web3);    
        
    }
    const addMe = ()=>{
        const address = wallet.getAddress(0)
        console.log(address);
        fetch("http://localhost:3010/register",{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({data:address})
        }).then((res)=>{
            console.log(res);
            console.log(res.body); 
            return res.json()
            
        }).then((data)=>{
            console.log(data);
        })
    }
    return (
    <div>
    <button onClick={generate}> generate </button>
    please save  the menomic for later use <br/>
    {menomic}
    <br/>
    <button onClick={addMe}>ask to be added to the voter list</button>
        
    </div>
    )
}

export default AddVoterForm
