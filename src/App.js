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

  update(property) {
    return e => this.setState({ [property]: e.target.value });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
          <form>
            <input id="date" type="date" onChange={this.update('dateTime')}></input>
            <input onChange={this.update('userNumber')}></input>
            <input onChange={this.update('dateNumber')}></input>
            <input onChange={this.update('safetyNumber')}></input>
          </form>
      </div>
    );
  }
}

export default App;
