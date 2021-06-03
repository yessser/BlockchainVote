import React from 'react'
import { DrizzleContext  } from "@drizzle/react-plugin";
import ReadString from "./ReadString";
import SetString from "./SetString";
const App = props => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <ReadString drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)
  


export default App
