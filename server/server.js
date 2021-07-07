const canvas = require("canvas")
const faceapi = require("face-api.js")
require('@tensorflow/tfjs-node');
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })


const express = require('express')
var multer = require('multer');
//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
});
const fileFilter=(req, file, cb)=>{
 if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
     cb(null,true);
 }else{
     cb(null, false);
 }

} 
var upload = multer({ 
  storage:storage
  //fileFilter:fileFilter
});
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
const privateKey = "247841a63cc61827b4a7459af8057bdbb0a3b959fd48e24d538c6cb06fadb343";
const publicKey = "0x52416581dA37DB64F36614E3Ce7f89f5250d42b1";
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
const addvoter = async (address)=>{
  const contract = new web3.eth.Contract(
    BallotBox.abi,
    BallotBox.networks[networkId].address
  );
  try{
    const added = await contract.methods.addVoterToVoterList(address).send({from:publicKey})
    await web3.eth.sendTransaction({from:publicKey, to:address, value: web3.utils.toWei("0.5", "ether")})
  }catch(e){
    console.log("voter already added");
    console.log(e);
  }
  
}
app.post("/startDecrypt", async (req,res)=>{
  //partie broadcast cle privee
  Gen=req.body.data
  console.log("received data");
  console.log(Gen);
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
    const tx = await  contract.methods.setInfo(gArray,pArray,xArray,yArray).send({from:publicKey, gas:1000000})
  
  console.log("gonna start decryption");
  //partie decryption
  const ballotCount = await contract.methods.ballotCount().call()
  const g = await contract.methods.getInfo().call() 

  var Gen1 = new ElGamal.default(parsefetch(g.p),parsefetch(g.g),parsefetch(g.y),parsefetch(g.x))
  var element
  var resu={}
  for (let i = 0; i <ballotCount; i++) {
    element = await contract.methods.getBallotByIndex(i).call();
    resu.a=new BigInteger(element.A)
    resu.b=new BigInteger(element.B)
    const decrypValue = await Gen1.decryptAsync(resu)
    console.log(decrypValue.toString());
    await contract.methods.Decrypt(i,decrypValue.toString()).send({from:publicKey,gas:1000000})
  }
  try{
    await contract.methods.setDecryptEnd().send({from:publicKey, gas:1000000})
  }catch(e){
    console.log(e);
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
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
const YESSER = "./images/100001308028260002.jpg"
const ROCK = "./images/theRock.jpg"
app.post("/uploadForm",upload.single("myImg"),async (req,res,next)=>
{
  console.log(req.body.ID);
  var imgLink = "./images/"+req.body.ID+".jpg"
  try{
    var ref = await canvas.loadImage(imgLink)
  }
  catch(err){
    res.json({message:"Id introuvable"})
    return;
  }
  const img = await canvas.loadImage(req.body.myImg)
  if(!img){
    res.json({message:"fichier recue invalide"})
    return;
  }
  console.log("imgs loaded");
  const imgFace = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor()
    if (!imgFace) {
      res.status(200).json({message:"no Face"})
      return;
    }else{
      console.log("face found ");
      const refImg = await faceapi
        .detectSingleFace(ref)
        .withFaceLandmarks()
        .withFaceDescriptor()
      const faceMatcher = new faceapi.FaceMatcher(refImg)
      const bestMatch = faceMatcher.findBestMatch(imgFace.descriptor)
      if(bestMatch._label=="person 1"){
        console.log("valid");
        addvoter(req.body.address)
        res.json({message:"valid"})
      }else{
        console.log("unkown");
        res.json({message:"inconnu"})
      }
    }
  /*  
  if(req.file)
  {const pathName=req.file.path;
    console.log(pathName)
      try{    
        res.status(200).json({message:"Saved successfully"})
          
      }catch(err){
        res.status(400).json({message:'User could not be saved'})
      }
    
  }
  else{
    res.status(400).json({message:'User Image does not exists'})
  }*/
});

const initAi = async ()=>{
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
    console.log("intialized the net");
}

initAi()