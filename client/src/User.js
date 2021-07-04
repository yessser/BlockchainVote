import React, { useState, useEffect } from "react"
import {useForm} from 'react-hook-form';

import {newContextComponents} from "@drizzle/react-components";
import AddVoterForm from "./AddVoterForm";
import ChoiceForm from "./ChoiceForm";
import Home from './components/Home/Home'

import ElGamal from "elgamal";
import {BigInteger} from 'jsbn';
const BallotBoxx = require("./contracts/BallotBox.json")


const {AccountData, ContractData, ContractForm}=newContextComponents;


const User = props => {
  const { drizzle, drizzleState } = props
  const accounts =drizzleState.accounts
  const { BallotBox } = drizzleState.contracts
  
  const [genId, setGenId] = useState(null)
  const [Gen, setGen] = useState(null)

  const [wallet, setWallet] = useState(null)
  const [menomic, setMenomic] = useState("")
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async data => {
    const networkId = await wallet.eth.net.getId();
    const contract = new wallet.eth.Contract(
      BallotBoxx.abi,
      BallotBoxx.networks[networkId].address
    );
    console.log(Gen);
    let resu = await Gen.encryptAsync(data);
    console.log(resu);
    contract.methods.vote(resu.a.toString(),resu.b.toString()).send({from:wallet.currentProvider.getAddress(0), gas:1000000})
  }
  
  const parsefetch = (value)=>{
    var resu; 
    if(value.length===518){//REMINDER I NEED TO CHANGE THIS IN THE FUTURE TO AN ACTUAL FIX  BUT IT WORKS FOR NOW 
      
       resu = new Int8Array((value.length-2)/2 -1)
    }else{
      
       resu = new Int8Array((value.length-2)/2)
    }
    
    for(var i=2;i<value.length;i=i+2){
      var tmpS= "0x"+value[i]+value[i+1]
      var tmp = parseInt(tmpS)
      if(tmp>=128){
        tmp= tmp-1;
        tmp= ~tmp
        tmp=-1*tmp;
      }
      resu[(i-2)/2]=tmp
    }
    var bigNum= new BigInteger(resu)
    return bigNum
  }
  
  useEffect(() => {
    const contract = drizzle.contracts.BallotBox;
    const GenKey= contract.methods.getInfo.cacheCall();
    const gen = BallotBox.getInfo[GenKey]
    if(!(typeof gen === "undefined")){
      
      const g= new ElGamal(parsefetch(gen.value.p),parsefetch(gen.value.g),parsefetch(gen.value.y),parsefetch(gen.value.x))
      setGen(g) 
    }
    setGenId(GenKey)
  }, [genId,BallotBox.getInfo[genId]])
  
  
  return (
    <div>  
    
     <div >
      <AddVoterForm drizzleState={drizzleState} wallet={wallet} setWallet={setWallet} menomic={menomic} setMenomic={setMenomic}/>
     </div>
     <ChoiceForm onSubmit={onSubmit}/>
      <div> 
        <br/>
        {
        /**/}
      </div>
      
    </div>
    
  )
  
}

export default User