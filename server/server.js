import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const express = require('express')
var cors = require('cors')
const app = express()
const port = 3010
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/",require("./routes/dataRoute"))

//////////////////////////////////
const ElGamal = require("elgamal")
const {BigInteger} = require("jsbn")
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
const Provider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const BallotBox = require("./../client/src/contracts/BallotBox.json")
const privateKey = "be87de7bce2ba50fdc76f8bfc549a284d327868815c8e805d456c63174aaf0c1";
const publicKey = "0x9a417d542C86fDF18a3BaA00f192c59D5Fd97434";
let web3 = null;
var networkID= null;
const init3 = async () => {
  const provider = new Provider(privateKey,'HTTP://127.0.0.1:7545'); 
  web3 = new Web3(provider);
  networkId = await web3.eth.net.getId();
}
init3()
// request that handles the voter registration
//TODO  ADD SENDING PICTURE AND FACE RECOGNITION
app.post("/register",async (req,res)=>{
  console.log(req.body);
  const contract = new web3.eth.Contract(
    BallotBox.abi,
    BallotBox.networks[networkId].address
  );
  try{
    const added = await contract.methods.addVoterToVoterList(req.body.data).send({from:publicKey})
    await web3.eth.sendTransaction({from:publicKey, to:req.body.data, value: web3.utils.toWei("0.5", "ether")})
    res.json(
      {
        result:"voter Added !"
      })
  }catch(e){
    
    console.log(e);
    res.json({
      result:"problem happened!"
    })
  }
  
})
app.post("/startDecrypt", async (req,res)=>{
  //partie broadcast cle privee
  Gen=req.body.data
  console.log("started");
  const contract = new web3.eth.Contract(
    BallotBox.abi,
    BallotBox.networks[networkId].address
  );
    const gby=new BigInteger(Gen.g).toByteArray()
    const pby=new BigInteger(Gen.p).toByteArray()
    const xby=new BigInteger(Gen.x).toByteArray()
    const yby=new BigInteger(Gen.y).toByteArray()

    var gArray = ByteArrayToUint(gby)
    var pArray = ByteArrayToUint(pby)
    var xArray = ByteArrayToUint(xby)
    var yArray = ByteArrayToUint(yby)
    console.log(yArray);
    const tx = await  contract.methods.setInfo(gArray,pArray,xArray,yArray).send({from:publicKey, gas:1000000})
  
  console.log("gonna start decryption");
  //partie decryption
  const ballotCount = await contract.methods.ballotCount().call()
  const g = await contract.methods.getInfo().call() 
  var Gen = new ElGamal.default(parsefetch(g.p),parsefetch(g.g),parsefetch(g.y),parsefetch(g.x))
  var element
    var resu={}
    var decrypValue
  for (let i = 0; i <ballotCount; i++) {
    element = await contract.methods.getBallotByIndex(i).call();
    resu.a=new BigInteger(element.A)
    resu.b=new BigInteger(element.B)
    const decrypValue = await Gen.decryptAsync(resu)
    console.log(decrypValue.toString());
    await contract.methods.Decrypt(i,decrypValue.toString()).send({from:publicKey,gas:1000000})
  }

  res.json({
    result:ballotCount
  })

})
app.post("/toggleVote",async ()=>{

})
app.post("/toggleRegister",async ()=>{

})
app.post("/reset",async ()=>{
  
})
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})