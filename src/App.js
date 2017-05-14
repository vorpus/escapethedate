import React, { Component } from 'react';
import DateForm from './components/DateForm/index';
import Instructions from './components/Instructions/index';
import './App.css';
import './style.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="mainform">
          <img src="./escape.png" alt="escape the date"/>
          <DateForm />
        </div>
        <Instructions />
      </div>
    );
  }
}

export default App;
