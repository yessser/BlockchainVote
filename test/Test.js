const BallotBox = artifacts.require("BallotBox")

const myVote = "this is my vote xD"

contract("BallotBox", async accounts=>{
    it("should add voter to allowed votes and make him vote", ()=>{
        return BallotBox.deployed()
        .then((instance)=>{
            return instance.addVoterToVoterList(accounts[1])
            .then(()=>{
                expectedvoter=instance.votersList.call(accounts[1]);
                return  (expectedvoter)
            }).then((expectedvoter)=>{
                assert.equal(expectedvoter,true,"expected voter not the added voter")
                
                instance.vote(myVote,{from:accounts[1]})
                hasvoted=instance.alreadyVoted.call(accounts[1]);
                return hasvoted
            }).then((hasvoted)=>{
                assert.equal(hasvoted,true,"he should have voted ")

            })
            
        })        
    })
    it("should change the encryption data",async ()=>{
        var instance = await BallotBox.deployed()
        await instance.setInfo(10,20,30,40)//g p x y 
        const info =await instance.getInfo();
        console.log("IAM HERE HELPPP");
        console.log(info)
        await assert.equal(10,info[0],"wasnt gen set");
        await assert.equal(20,info[1],"wasnt sdsset");
        await assert.equal(30,info[2],"wasnt priv set");
        await assert.equal(40,info[3],"wasnt pubs set");
    })
});