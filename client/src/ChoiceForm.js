import React, { useEffect } from 'react'
import "./index.css";
const ChoiceForm = (props) => {
    const onSubmit = props.onSubmit
    const set = props.set
    const candidatList = [{name:"candidat 1",id:1},{name:"candidat 2",id:2},{name:"candidat 3",id:3}]
    return (
        <div className='wrapper'>
            <h2>veulliez choisir le candidat voulue</h2>
        
            <div className="listeCandidat">
                {candidatList.map((candidat)=>{
                    return(<div className="elementCandidat" key={candidat.id} onClick={async ()=>{await onSubmit(candidat.name);set(false);}}>{candidat.name}</div>)
                })}
            </div>
        </div>
    )
}

export default ChoiceForm