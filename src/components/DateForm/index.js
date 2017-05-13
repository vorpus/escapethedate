import React, { Component } from 'react';
import DateTime from 'react-datetime';
import './DateForm.css';
import './react-datetime.css';
import moment from 'moment';

class DateForm extends Component {
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
      <div className="dateform">
        <form>
          <div className='form-group'>
            <label htmlFor='dateTime'>Date time</label>
            <DateTime
              id='dateTime'
              defaultValue={moment()}
              onChange={this.updateDate}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='userNumber'>Your number</label>
            <input id='userNumber' type='number' onChange={this.update('userNumber')}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='dateNumber'>Their number</label>
            <input id='dateNumber' type='number' onChange={this.update('dateNumber')}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='safetyNumber'>Friend's number</label>
            <input id='safetyNumber' type='number' onChange={this.update('safetyNumber')}></input>
          </div>
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

export default DateForm;
