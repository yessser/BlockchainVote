import React from 'react'
import { DrizzleContext  } from "@drizzle/react-plugin";
import User from "./User";
import Owner from './Owner';
import Resultat from './components/Resulat'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
const App = props => (
  
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <div>
        <Router>
        <Switch>
          <Redirect exact from="/" to="/user" />
          <Route path="/admin">
            <Owner drizzle={drizzle} drizzleState={drizzleState}/>  
          </Route>
          
          <Route path="/user">
            <User drizzle={drizzle} drizzleState={drizzleState} />
          </Route>
          
        </Switch>
        {/*<Owner drizzle={drizzle} drizzleState={drizzleState}/>
        <br/><br/><h3>voter side</h3>
        <User drizzle={drizzle} drizzleState={drizzleState} />*/
        }
        </Router>
        </div>
        
      );
    }}
  </DrizzleContext.Consumer>
)
  


export default App
