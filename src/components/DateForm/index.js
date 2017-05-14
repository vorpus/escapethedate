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
      dateTime: moment().startOf('hour').add(1, 'hour'),
      dateNumber: '',
      safetyNumber: ''
    }

    this.updateDate = this.updateDate.bind(this);
  }

  submitContact(e) {
    fetch('http://localhost:3030/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.userNumber,
        datetime: this.state.dateTime,
        datee: this.state.dateNumber,
        friend: this.state.safetyNumber,
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
      if (numberVal.length > 10) {
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
              defaultValue={this.state.dateTime}
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
          Schedule the Date!
        </button>
      </div>
    );
  }
}

export default DateForm;
