import React, {Fragment, useState, useEffect ,useMemo} from 'react';
import { Chart } from 'react-charts'
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import "./Home/homeStyles.css";
const Resultat = (props) => {
    const d= {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

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
    const [data, setData] = useState([])
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
           setX(array)
        }
        
        all()
        
      }
    },[BallotBox.ballotCount[countKey]])
    useEffect(() => {
      
      var d=[];
      var labels=[];
      console.log(x)
      //d.push({label:"0",data:[[0,0]]})
      for (var key of Object.keys(x)) {
        console.log(key)
        labels.push(key)
        d.push(x[key])
      }
      console.log(d)
      console.log(labels)
      const data={
        labels:labels,
        datasets:[
          {
            label:"number of votes",
            data:d,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          }
        ],
        
      }
      setData(data)
      //d.push({label:null,data:[[0,0]]})
      console.log(data);
      
    }, [x])

  //  const data = useMemo(
    //     Resultat,[x]
      //)

    if(s&&s.value){
      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio:false,
      };
      return(
        <div className="home-container">
            <div className="topnav">
                <Link to={url+"/vote"}>voter</Link>
                <Link to={url+"/resultat"}>Resultat</Link>
            </div>
            <div className="chart-container" >
                <div className="chart">
                  <Bar data={data} options={options} />
                </div>
            </div>
        </div>
        )
    }
    else{
      
        return (
          <div className="home-container">
            <div className="topnav">
              <Link to={url+"/vote"}>voter</Link>
              <Link to={url+"/resultat"}>Resultat</Link>
            </div>
            <div className="center">
              <div className="container">
                <div className="text">
                  <h1 className="message">
                      le vote n'as pas encore etait decrypte
                  </h1>
                </div>
              </div>
              <Link to={url+"/vote"}> retour a la page du vote</Link>
            </div>
          </div>
        )
    }
}

export default Resultat
