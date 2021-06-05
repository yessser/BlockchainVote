pragma solidity >=0.5.0 <0.8.0;

contract BallotBox {
     struct ballot {
        address voter;
        string Data;  
    }
    address public currentOwner;
    function isOwner() public view returns (bool) {
        return msg.sender == currentOwner;
    }
    modifier onlyOwner() {
        require(isOwner(), "Only Owner can do this!");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Can not transfer to Zero!");
        emit OwnershipTransferred(currentOwner, newOwner);
        currentOwner = newOwner;
    }
    
    ballot[] private ballotList;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event encryptionSet(bytes g,bytes p,bytes x,bytes y);
    event AllowedVoterAdded(address voter);
    event BallotAdded(address voter,string data);

    mapping(address=>bool) public votersList;
    mapping(address=>bool) public alreadyVoted;
    bytes public publicKey;
    bytes public privateKey;
    bytes public generator;
    bytes public prime;
    
    int smthn;
    bool registryPeriodEnd;
    bool votePeriodEnd;
    
    constructor (bytes memory _publicKey,bytes memory _generator,bytes memory _prime) public {
        require(
            _publicKey.length != 0,
            "Must pass proper Public Key!");
        currentOwner = msg.sender;
        emit OwnershipTransferred(address(0), currentOwner);
        registryPeriodEnd=false;
        votePeriodEnd=false;
        publicKey=_publicKey;
        generator=_generator;
        prime=_prime;
        
    }
    function getBallotByIndex(uint index) view public returns(string memory,address)  {
        require(index<ballotList.length,"Must pass valid index!");
        ballot memory b = ballotList[index];
        return(b.Data,b.voter);
    }
    function setInfo( bytes calldata  g,bytes calldata  p,bytes calldata  x,bytes calldata  y) external onlyOwner {
        generator=g;
        prime=p;
        privateKey=x;
        publicKey=y;
        emit encryptionSet(g, p, x, y);
    }
    function getInfo()view public returns(bytes memory g ,bytes memory p,bytes memory x, bytes memory y){
        return(generator,prime,privateKey,publicKey);
    }
    
    function addVoterToVoterList(address voter) external onlyOwner {
        require(votersList[voter]==false,"voter already added");
        require(!registryPeriodEnd,"registry period already ended");
        votersList[voter]=true;
        smthn=smthn+1;
        alreadyVoted[voter]=false;
        emit AllowedVoterAdded(voter);
    }

    function vote(string memory _data) public {
        require(votersList[msg.sender],"youre not a valid voter");
        require(!alreadyVoted[msg.sender],"you already voted");
        require(!votePeriodEnd,"voting period already ended");
        alreadyVoted[msg.sender]=true;
        ballot memory balot=ballot(msg.sender,_data);
        ballotList.push(balot);
        emit BallotAdded(msg.sender,_data);

    }
   
}