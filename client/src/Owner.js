import React ,{useState}from 'react'
const Owner = () => {
   
    const [Owner, setOwner] = useState("")
    const OwnerChange = (event)=>{
        setOwner(event.target.value);
        console.log("Changed")
    }
    return (
        <div>
        <input type="text" onChange={OwnerChange}/>
        BOIN :{Owner}
        </div>
    )
}

export default Owner
