import React, { Component } from 'react';
import DateTime from 'react-datetime';
import './App.css';
import './react-datetime.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userNumber: '',
      dateTime: '',
      dateNumber: '',
      safetyNumber: ''
    }

    this.updateDate = this.updateDate.bind(this);
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

  updateDate(e) {
    this.setState({
      dateTime: e.toDate(),
    });
  }

  render() {
    return (
      <div className="App">
          <form>
            <DateTime onChange={this.updateDate}/>
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
