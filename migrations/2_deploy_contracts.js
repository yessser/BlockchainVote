const BallotBox = artifacts.require("BallotBox");
const MyStringStore = artifacts.require("MyStringStore")
module.exports = function(deployer) {
  deployer.deploy(BallotBox,3,4,5);

};