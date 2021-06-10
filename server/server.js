const express = require('express')
var cors = require('cors')
const app = express()
const port = 3010
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/",require("./routes/dataRoute"))

//////////////////////////////////
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
  const myContract = new web3.eth.Contract(
    BallotBox.abi,
    BallotBox.networks[networkId].address
  );
  try{
    const added = await myContract.methods.addVoterToVoterList(req.body.data).send({from:publicKey})
    web3.eth.sendTransaction({from:publicKey, to:req.body.data, value: web3.utils.toWei("0.5", "ether")})
    res.json(
      {
        result:"voter Added !"
      })
  }catch(e){
    console.log("YA FAKING MORON yA ALREADY ADDED FAKTHING THIEF");
    res.json({
      result:"problem happened!"
    })
  }
  
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})