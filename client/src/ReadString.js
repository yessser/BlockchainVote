import React, { useState, useEffect } from "react"
import {newContextComponents} from "@drizzle/react-components";
import AddVoterForm from "./AddVoterForm";
import ElGamal from "elgamal";
import {BigInteger} from 'jsbn' ;
const {AccountData, ContractData, ContractForm}=newContextComponents;

const Readstring = props => {
  const { drizzle, drizzleState } = props
  const accounts =drizzleState.accounts
  const { BallotBox } = drizzleState.contracts
  const [ballotKey, setBallotKey] = useState(null)
  const [genId, setGenId] = useState(null)
  const [Gen, setGen] = useState(null)
  const [stackId, setStackId] = useState(null)
  
  

  const testEncryption = async ()=>{
    //console.log(gen&&gen.value.g);
    const secret="secretsdasdsada vote"
    //const g= new ElGamal(gen.value.p,gen.value.g,gen.value.y,gen.value.x)
    //console.log(g)
    //setGen(g)
    var resu = await Gen.encryptAsync(secret);
    const decryp = await Gen.decryptAsync(resu)
    console.log(secret);
    console.log(resu)
    console.log(resu.a.toByteArray());
    console.log(resu.b.toByteArray());
    console.log(decryp.toString())

  }
  const SendElgamal = async ()=>{ //send a new elgamal instance to blockchain
    const ByteArrayToUint= (array)=>{
      var tmp,i;
      if(array.length%2===0){
         tmp= new Uint8Array(array.length)
        for(i=0;i<array.length;i++){
         tmp[i]=array[i];
        }
      }else{
         tmp= new Uint8Array(array.length+1)
        for(i=0;i<array.length;i++){//if array is impaire
         tmp[i]=array[i];
        }
        tmp[array.length]=0;
      }

      return tmp
    }
    
    const eg = await ElGamal.generateAsync();
    const contract = drizzle.contracts.BallotBox;
     
    const gby=eg.g.toByteArray()
    const pby=eg.p.toByteArray()
    const xby=eg.x.toByteArray()
    const yby=eg.y.toByteArray()
    var gArray = ByteArrayToUint(gby)
    var pArray = ByteArrayToUint(pby)
    var xArray = ByteArrayToUint(xby)
    var yArray = ByteArrayToUint(yby)

    const tx= contract.methods.setInfo.cacheSend(gArray,pArray,xArray,yArray,{from:accounts[0], gas:1000000})
  
  }
  const parsefetch = (value)=>{
    if(value.length===518){//REMINDER I NEED TO CHANGE THIS IN THE FUTURE TO AN ACTUAL FIX  BUT IT WORKS FOR NOW 
      
      var resu = new Int8Array((value.length-2)/2 -1)
    }else{
      
      var resu = new Int8Array((value.length-2)/2)
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
  const FetchElgamal = ()=>{
   //does nothing for now 
  }
  useEffect(() => {
    const contract = drizzle.contracts.BallotBox;
    ;
    const GenKey= contract.methods.getInfo.cacheCall()
    const gen = BallotBox.getInfo[GenKey]
    if(!(typeof gen === "undefined")){
      
      const g= new ElGamal(parsefetch(gen.value.p),parsefetch(gen.value.g),parsefetch(gen.value.y),parsefetch(gen.value.x))
      setGen(g) 
    }
    setGenId(GenKey)
  }, [genId,BallotBox.getInfo[genId],drizzle.contracts.BallotBox])
  

  /*  
  useEffect(() => {
      const contract = drizzle.contracts.BallotBox;
      const ballotKey= contract.methods.publicKey.cacheCall()
      setBallotKey(ballotKey)
    }, [ballotKey,drizzle.contracts.BallotBox])
  const publicKey = BallotBox.publicKey[ballotKey]*/
 
  return (
    // if it exists, then we display its value
    <div>  
    <div>
      add voter to voter list
    </div>
     
    AND NOW WE GONNA VOTE 
    <div>
    <button onClick={()=>testEncryption()}>test elgamal</button>
    <button onClick={()=>SendElgamal()}>send generator data to contract</button>
    <button onClick={()=>FetchElgamal()}>return the  generato info rn </button>
    
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