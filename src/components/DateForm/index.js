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
    return e => {
      const numberVal = e.target.value;
      if (numberVal.length > 9) {
        return;
      }
      this.setState({ [property]: e.target.value })
    };
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
            <label htmlFor='userNumber'>💁</label>
            <input
              id='userNumber'
              value={this.state.userNumber}
              type='number'
              placeholder='Your number'
              onChange={this.update('userNumber')}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='dateNumber'>👤</label>
            <input
              id='dateNumber'
              value={this.state.dateNumber}
              type='number'
              placeholder='Their number'
              onChange={this.update('dateNumber')}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='dateTime'>⏰</label>
            <DateTime
              id='dateTime'
              defaultValue={moment().startOf('hour').add(1, 'hour')}
              timeConstraints={
                {minutes: {
                  step: 30,
                }}
              }
              onChange={this.updateDate}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='safetyNumber'>🕵️‍♀️</label>
            <input
              id='safetyNumber'
              value={this.state.safetyNumber}
              type='number'
              placeholder='SOS number'
              onChange={this.update('safetyNumber')}
            />
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
