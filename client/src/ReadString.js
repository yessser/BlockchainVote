import React, { useState, useEffect } from "react"
import {newContextComponents} from "@drizzle/react-components";
import AddVoterForm from "./AddVoterForm";
import ElGamal from "elgamal";
import {BigInteger} from 'jsbn' ;
const {AccountData, ContractData, ContractForm}=newContextComponents;

const Readstring = props => {
  const [ballotKey, setBallotKey] = useState(null)
  const [genId, setGenId] = useState(null)
  const [Gen, setGen] = useState(null)
  const [stackId, setStackId] = useState(null)
  const { drizzle, drizzleState } = props
  const accounts =drizzleState.accounts
  const { BallotBox } = drizzleState.contracts

  const Generate = async ()=>{
    const secret="secret vote"
    var resu = await Gen.encryptAsync(secret);
    const decryp = await Gen.decryptAsync(resu)
    console.log(secret);
    console.log(resu)
    console.log(decryp.toString())

  }
  const SendElgamal = async ()=>{
    
    const contract = drizzle.contracts.BallotBox;
    
    const gby=Gen.g.toByteArray()
    console.log(Gen.g);
    console.log(gby);
    /*const pby=Gen.p.toByteArray()
    const xby=Gen.x.toByteArray()
    const yby=Gen.y.toByteArray()
    
    console.log(gby.toString());
    
    const tx= contract.methods.setInfo.cacheSend(gby,pby,xby,yby,{from:accounts[0]})
    setStackId(tx);
    */

    
    var typedArray2 = new Uint8Array(gby.length)
    
    //typedArray2.set(gby)
    for(var i=0;i<gby.length;i++){
      typedArray2[i]=gby[i];
    }
    
    //typedArray2 = gby.slice(0,10)
    console.log(typedArray2);
    const tx= contract.methods.setInfo.cacheSend(typedArray2,2,3,4,{from:accounts[0], gas:1000000})
  }
  
  const FetchElgamal = ()=>{
    const g = BallotBox.getInfo[genId].value.g
    var resu = new Int8Array(g.length-2)//-2 cause 0x au debut cause hex
     
    for(var i=2;i<g.length;i=i+2){
      if(["8","9","A","B","C","D","E","F"].includes(g[i].toString())){
        tmp=10+parseInt()
      }
      else{

      }
      var tmpS= "0x"+g[i]+g[i+1]
      var tmp = parseInt(tmpS)
      resu[i-2]=tmp
    }
    console.log(BallotBox.getInfo[genId].value.g)
    console.log(new BigInteger(resu));
  }
  useEffect(  () => {
    const init = async ()=>{
      const g = await ElGamal.generateAsync(1024);
      console.log(g)
      setGen(g) 
    }
    init()
    }, [])
    
  useEffect(() => {
      const contract = drizzle.contracts.BallotBox;
      const ballotKey= contract.methods.publicKey.cacheCall()
      setBallotKey(ballotKey)
    }, [ballotKey,drizzle.contracts.BallotBox])
  const publicKey = BallotBox.publicKey[ballotKey]
  useEffect(() => {
    const contract = drizzle.contracts.BallotBox;
    
      const GenKey= contract.methods.getInfo.cacheCall()
      setGenId(GenKey)
  }, [genId,drizzle.contracts.BallotBox])
  return (
    // if it exists, then we display its value
    <div>  
    <div>
      add voter to voter list
      {publicKey&&publicKey.value}
    </div>
     
    AND NOW WE GONNA VOTE 
    <div>
    <button onClick={()=>Generate()}>test elgamal</button>
    <button onClick={()=>SendElgamal()}>send generator data to contract</button>
    <button onClick={()=>FetchElgamal()}>return the  generato info rn </button>
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract="BallotBox"
      method="publicKey"
    />
    generator
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract="BallotBox"
      method="generator"
    />
    prime
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract="BallotBox"
      method="prime"
    />
    <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="BallotBox"
        method="vote"
        sendArgs={{from:accounts[1],gas:6721975,gasPrice:"200000"}}
    />
    </div>
    
    </div>
    
  )
}

export default Readstring