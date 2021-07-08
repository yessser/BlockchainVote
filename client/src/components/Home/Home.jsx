import React, {Fragment, useState,useEffect,useRef,useLayoutEffect } from 'react'
import './homeStyles.css'
import { WebcamCapture} from '../Webcam/Webcam'
import ChoiceForm from "../../ChoiceForm";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch
} from "react-router-dom";

const Home = (props) => {
    const wallet = props.wallet
    const generate = props.generate
    const onSubmit = props.onSubmit
    const [name, setName] = useState('')
    const [myImg, setMyImg] = useState("")
    const [redirect, setRedirect] = useState(false)
    let { path, url } = useRouteMatch();
    const firstUpdate = useRef(true);
    useEffect(() => {
      if(redirect==false){
        console.log("poof");
        generate()
      }
    },[redirect]);
    
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
        console.log(res.message);
        if(res.message=="valid"){setRedirect(true)}
        else{
          alert("veulliez verifiez vos information sont correct et votre photo visible")
        }
        })
      .catch(err=>console.log(err));
      
    }
    if(!redirect){
    return (
      <div className="home-container">
        <div className="topnav">
            <Link to={url}>voter</Link>
            <Link to={"resultat"}>Resultat</Link>
        </div>
        <div className="container">
                <div className="text">
                  <h1>veuiller prendre une photo et remplir votre numero d'identite national</h1>
                  <form className="form">
                    <WebcamCapture setImage={setMyImg} image={myImg}/>
                    <input type="text" placeholder="ID" onChange={(e) => setName(e.target.value)} />
                    <button type="submit" onClick={(e) => submitForm(e)}>validation</button>
                  </form>
                </div>
            </div>
      </div>
      )
    }
    else{
      return(
      <Fragment>
        <div className="topnav">
            <Link onClick={()=>{setRedirect(false)}} to={url}>voter</Link>
            <Link to={"resultat"}>Resultat</Link>
        </div>
        <ChoiceForm set={setRedirect} onSubmit={onSubmit} wallet={wallet} />
      </Fragment>
      )
    }
}
export default Home
