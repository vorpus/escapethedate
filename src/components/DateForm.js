import React, { Component } from 'react';
import { ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap';
import DateTime from 'react-datetime';
import './react-datetime.css'
import './dateform.css'

class DateForm extends Component {
  constructor() {
    super();

    this.state = {
      userNumber: '',
      dateTime: '',
      dateNumber: '',
      safetyNumber: '',
    }
  }

  update(property) {
    return e => this.setState({ [property]: e.target.value });
  }

  render() {
    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    return (
      <form className='dateform'>
        <FieldGroup
          id='userNumber'
          type='number'
          label='your number'
          placeholder='your number'
          onChange={() => this.update}
        />
        <FieldGroup
          id='dateNumber'
          type='number'
          label='their number'
          placeholder='their number'
        />
        <div className='form-group'>
          <label htmlFor='datetime'>
            hello
          </label>
          <DateTime id='datetime' />
        </div>
        <FieldGroup
          id='safetyNumber'
          type='number'
          label='safety number'
          placeholder='safety number'
        />
      </form>
    );
  }
}

export default DateForm;
