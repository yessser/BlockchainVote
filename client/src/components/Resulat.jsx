import React, {Fragment, useState, useEffect ,useMemo} from 'react';
import { Chart } from 'react-charts'
import { Link } from 'react-router-dom';
const Resultat = (props) => {
    const { drizzle, drizzleState } = props
    const url = props.url
    const { BallotBox } = drizzleState.contracts
    const [voteDecrypt, setVoteDecrypt] = useState(null)
    const [countKey,setCount] = useState(null)
    const s = BallotBox.decryptEnd[voteDecrypt]
    const count = BallotBox.ballotCount[countKey]
    useEffect(() => {
        const contract = drizzle.contracts.BallotBox;
        const GenKey= contract.methods.decryptEnd.cacheCall();
        setVoteDecrypt(GenKey)
    }, [voteDecrypt,BallotBox.decryptEnd[voteDecrypt]])
    useEffect(() => {
      const contract = drizzle.contracts.BallotBox;
      const key= contract.methods.ballotCount.cacheCall();
      setCount(key)
    }, [countKey])

    const [x, setX] = useState({})
    
    useEffect( ()=>{
      const contract = drizzle.contracts.BallotBox;
      if(count && s){
        const c = count.value
        var array = {} 
        const iter = async (i)=>{
          const element = await  contract.methods.getBallotByIndex(i).call()
          const x = array[element.value]
          console.log(x);
          if(x){
            array[element.value]=array[element.value]+1;
          }else{
            console.log("here");
            array[element.value]=1;
          }
        }
        const all = async ()=>{
          for (let i = 0; i < c; i++) {
            await iter(i)
          }
          await setX(array)
        }
        
        all()
        
      }

    },[BallotBox.ballotCount[countKey]])

    const Resultat = () =>{
      var d=[];
      console.log(x)
      //d.push({label:"0",data:[[0,0]]})
      for (var key of Object.keys(x)) {
        console.log(key)
        d.push({label:key,data:[[key,x[key]]]})
      }
      //d.push({label:null,data:[[0,0]]})
      console.log(d);
      //return(d)
        return([
          {
            label: 'Series 1',
            data: [
              ["bla", 1],
              [1, 2],
              [2, 4],
              [3, 2],
              [4, 7],
            ],
          },
          {
            label: 'Series 1',
            data: [
              ["bla", 1],
              [1, 2],
              [2, 4],
              [3, 2],
              [4, 7],
            ],
          }
        ]
        )
    }
    const data = useMemo(
         Resultat,[x]
      )
    const series = useMemo(
        () => ({
          type: 'bar'
        }),
        []
      )
      const axes = useMemo(
        () => [
          { primary: true, type: 'ordinal', position: 'bottom' },
          { position: 'left', type: 'linear', stacked: false }
        ],
        []
      )
    

    if(s&&s.value){
        
      return(
        <Fragment>
            <div className="topnav">
                <Link to={url+"/vote"}>voter</Link>
                <Link to={url+"/resultat"}>Resultat</Link>
            </div>
            <div className="chart-container" >
                <div className="chart">
                  <Chart data={data} series={series} axes={axes} tooltip />
                </div>
            </div>
        </Fragment>
        )
    }
    else{
      
        return (
          <div >
            <div className="topnav">
              <Link to={url+"/vote"}>voter</Link>
              <Link to={url+"/resultat"}>Resultat</Link>
            </div>
                
          </div>
        )
    }
}

export default Resultat
