import React from 'react'
import "./index.css";
const ChoiceForm = (props) => {
    const onSubmit = props.onSubmit
    const candidatList = [{name:"boutef",id:1},{name:"taboun",id:2},{name:"rats",id:3}]
    return (
        <div className="center">
        <div>veulliez choisir le candidat voulue</div>
        <div className="listeCandidat">
            {candidatList.map((candidat)=>{
                return(<div className="elementCandidat" key={candidat.id} onClick={()=>onSubmit(candidat.name)}>{candidat.name}</div>)
            })}
        </div>
        </div>
    )
}

export default ChoiceForm