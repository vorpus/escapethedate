import React, { Component } from 'react';
import DateForm from './components/DateForm';
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

  submitContact(e) {
    fetch('/url', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        userNumber: this.state.userNumber,
        dateTime: this.state.dateTime,
        dateNumber: this.state.dateNumber,
        safetyNumber: this.state.safetyNumber,
      })
    })
    .then ((res) => {
      console.log(res.status)
    })
    .catch(err => console.log(err));
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
          <button
            onClick={this.submitContact.bind(this)}
          >
            Submit
          </button>
      </div>
    );
  }
}

export default App;
