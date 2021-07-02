import React,{} from 'react'
import {useForm} from 'react-hook-form';

import HDprovider from "@truffle/hdwallet-provider";
import { drizzleReducers } from '@drizzle/store';
const bip39 = require("bip39")
const Web3 = require("web3")
const AddVoterForm = props => {
    const drizzleState =props.drizzleState; 
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

        setWallet(new Web3(pro));
        const web3 = new Web3(pro);
        console.log(web3);    
    }
    const addMe =async ()=>{
        await generate()
        const address = wallet.currentProvider.getAddress(0)
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
    <button onClick={generate}> generation de compte </button>
    {menomic}
    <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("ID", { required: true })} />
        
        {errors.ID && alert("field is required")}
        {errors.ID && errors.ID.type === "required" && <span>This is required</span>}
        
        <input type="submit" />
        </form>
    <button onClick={addMe}>verification  et ajout a liste des votants</button>
        
    </div>
    )
}

export default AddVoterForm
