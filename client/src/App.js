import React from 'react'
import { DrizzleContext  } from "@drizzle/react-plugin";
import User from "./User";
import Owner from './Owner';
const App = props => (
  
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <div>
        <Owner drizzle={drizzle} drizzleState={drizzleState}/>
        <br/><br/><h3>voter side</h3>
        <User drizzle={drizzle} drizzleState={drizzleState} />  
        </div>
        
      );
    }}
  </DrizzleContext.Consumer>
)
  


export default App
