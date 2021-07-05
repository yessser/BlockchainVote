import React, { useState, useEffect ,useMemo} from 'react';
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

    const [x, setX] = useState([]) 
    useEffect( ()=>{
      const contract = drizzle.contracts.BallotBox;
      if(count){
        const c = count.value
        var array = {} 
        var array2 = {}
        console.log(c);
        const iter = async (i)=>{
          const element = await  contract.methods.getBallotByIndex(i).call()
          console.log(element.value)
          const x = array[element.value]
          if(x){
            array2.x=array2.x+1;
          }else{
            console.log("here");
            array[element.value]=element.value;
            array2[element.value]=1;
          }
        }

        for (let i = 0; i < c; i++) {
          iter(i)
        }
        console.log(array)
        console.log(array2)
        //setX(array);
      }

    },[BallotBox.ballotCount[countKey]])

    const Resultat = () =>{   
      
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
        ]
        )
    }
    const data = useMemo(
         Resultat,
        [x]
      )
    const series = useMemo(
        () => ({
          type: 'bar'
        }),
        []
      )
      const axes = useMemo(
        () => [
          { primary: true, type: 'ordinal', position: 'left' },
          { position: 'bottom', type: 'linear', stacked: true }
        ],
        []
      )
    

    if(s&&s.value){
        return(
            <div style={{
                width: `500px`,
                height: `300px`,   
              }}>
                qqchose{console.log(s)}
                <Chart data={data} series={series} axes={axes} tooltip />
            </div>
        )
    }
    else{
      
        return (
          <div>
            <div className="topnav">
              <Link to={url+"/vote"}>voter</Link>
              <Link to={url+"/resultat"}>Resultat</Link>
            </div>
                le vote n'as pas encore etait decryptee
          </div>
        )
    }
}

export default Resultat
