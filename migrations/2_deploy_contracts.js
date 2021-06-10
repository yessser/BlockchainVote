const BallotBox = artifacts.require("BallotBox");
module.exports = function(deployer) {
  deployer.deploy(BallotBox,3,4,5);
};