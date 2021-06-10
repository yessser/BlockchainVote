import React, { useState, useEffect } from "react"
import {useForm} from 'react-hook-form';

import {newContextComponents} from "@drizzle/react-components";
import AddVoterForm from "./AddVoterForm";
import ElGamal from "elgamal";
import {BigInteger} from 'jsbn';


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
    const contract = drizzle.contracts.BallotBox;
    console.log(data);
    let resu = await Gen.encryptAsync(data.candidat);
    contract.methods.vote.cacheSend(resu.a.toString(),resu.b.toString(),{from:accounts[1], gas:1000000})
  }
  
  const testEncryption = async ()=>{
    const secret="secretsdasdsada vote"
    
    var resu = await Gen.encryptAsync(secret);
    const decryp = await Gen.decryptAsync(resu)
    console.log(secret);
    console.log(resu);
    console.log(resu.a.toString())
    console.log(resu.a.toByteArray());
    console.log(resu.b.toByteArray());

    console.log(decryp.toString())

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
    
     <div>
       request verification from server (WIP){/* cant make post request work for no */} 
      <AddVoterForm wallet={wallet} setWallet={setWallet} menomic={menomic} setMenomic={setMenomic}/>
     </div>
     
      <div>
        <button onClick={()=>testEncryption()}>test elgamal</button>  
        <br/>
        Vote form with account 1
        
        <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("candidat", { required: true })} />
        
        {errors.exampleRequired && <span>This field is required</span>}
        
        <input type="submit" />
        </form>
        
      </div>
    
    </div>
    
  )
  
}

export default User