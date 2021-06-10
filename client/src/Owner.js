import React ,{useState}from 'react'
import ElGamal from "elgamal";
import {newContextComponents} from "@drizzle/react-components";
const {ContractForm}=newContextComponents;


const Owner = props => {
    
    const { drizzle, drizzleState } = props
    const accounts =drizzleState.accounts
    const sendElgamal = async ()=>{ //send a new elgamal instance to blockchain
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
        //TODO MAKE USE OF THE TRANSACTION CODE TO SHOW STATE CHANGE (pending finished ECT)
        const tx= contract.methods.setInfo.cacheSend(gArray,pArray,xArray,yArray,{from:accounts[0], gas:1000000})
      
    }
    
    return (
        <div>
        <button onClick={()=>sendElgamal()}>send generator data to contract</button>
        <button onClick={()=>startDecryption()}>please make the server decrypt</button>
        ADD VOTER TO THE VOTER LIST
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="BallotBox"
          method="addVoterToVoterList"
        />
        </div>
    )
}
const startDecryption=()=>{
  
}
export default Owner
