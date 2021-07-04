import React, { useState } from 'react'
import './homeStyles.css'
import { WebcamCapture} from '../Webcam/Webcam'


const Home = (props) => {
    const wallet = props.wallet
    const generate = props.generate
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [myImg, setMyImg] = useState("")

    const submitForm = async (e) =>
    {
      e.preventDefault();
      const formData= await new FormData();
      const address =  wallet.currentProvider.getAddress(0)
      console.log(formData.toString());
      formData.append('ID',name);
      console.log(formData);
      formData.append('myImg',myImg);
      formData.append("address",address)
      console.log(formData.toString());
      await fetch("http://localhost:3010/uploadForm",
      {
        method:'POST',
        body:formData
      }).then(res=>res.json())
      .then(res=>{
        console.log(res);
        })
      .catch(err=>console.log(err));
      
    }
    return (
        <div className="home-container">
            <div className="container">
                <div className="text">
                    <h1>Fill up this form!</h1>
                    <form className="form">
                        <WebcamCapture setImage={setMyImg} image={myImg}/>
                        <input type="text" placeholder="ID" onChange={(e) => setName(e.target.value)} />
                        <button type="submit" id="login-button" onClick={(e) => submitForm(e)}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Home
