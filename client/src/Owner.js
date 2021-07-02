import React ,{useState}from 'react'
import ElGamal from "elgamal";
import {newContextComponents} from "@drizzle/react-components";
const {ContractForm}=newContextComponents;


const Owner = props => {  
  const [Gen, setGen] = useState({})
  const { drizzle, drizzleState } = props
  const accounts =drizzleState.accounts
  const contract = drizzle.contracts.BallotBox;
  const startDecryption=async ()=>{
    fetch("http://localhost:3010/startDecrypt",{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({admin: true,data:{g:Gen.g.toString(),p:Gen.p.toString(),x:Gen.x.toString(),y:Gen.y.toString()}})
    }).then((data)=>{
      return data.json()
    }).then(dataJS =>{
      console.log(dataJS);
    })
  }
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
  const sendElgamal = async ()=>{ //send a new elgamal instance to blockchain
        const eg = await ElGamal.generateAsync();
        setGen(eg)
        const gby=eg.g.toByteArray()
        const pby=eg.p.toByteArray()
        const xby=eg.x.toByteArray()
        const yby=eg.y.toByteArray()
        var gArray = ByteArrayToUint(gby)
        var pArray = ByteArrayToUint(pby)
        var xArray = ByteArrayToUint(xby)
        var yArray = ByteArrayToUint(yby)
        //TODO MAKE USE OF THE TRANSACTION CODE TO SHOW STATE CHANGE (pending finished ECT)
        const tx= contract.methods.setInfo.cacheSend(gArray,pArray,0,yArray,{from:accounts[0], gas:1000000})
      
    }
    
    return (
        <div>
        <button onClick={()=>sendElgamal()}>send generator data to contract</button>
        <button onClick={()=>startDecryption()}>partage cle privee et commence decryptage</button>
        <button>commence/termine periode du vote</button>
        <button>commence/termine la periode d'inscription</button>
        </div>
    )
}

export default Owner
