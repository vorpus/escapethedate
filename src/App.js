import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userNumber: '',
      dateTime: '',
      dateNumber: '',
      safetyNumber: ''
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p className="App-intro">
          <form>
            <input id="date" type="date"></input>
            <input></input>
            <input></input>
          </form>
        </p>
      </div>
    );
  }
}

export default App;
