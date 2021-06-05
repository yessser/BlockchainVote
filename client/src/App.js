import React from 'react'
import { DrizzleContext  } from "@drizzle/react-plugin";
import ReadString from "./ReadString";
import SetString from "./SetString";
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
        <Owner/>
        <ReadString drizzle={drizzle} drizzleState={drizzleState} />  
        </div>
        
      );
    }}
  </DrizzleContext.Consumer>
)
  


export default App
