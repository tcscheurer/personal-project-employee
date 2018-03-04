import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import Landing from './Landing';
//import io from 'socket.io-client';
//import {SocketProvider} from 'socket.io-react';

////const socket = io.connect('http//:localhost:5000');

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={()=>{
            return(
            <Landing/>
            )
          }} /> 
          
        </Switch>
      </div>
    );
  }
}

export default App;
