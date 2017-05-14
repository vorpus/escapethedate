import React, { Component } from 'react';
import InstructionsStep from '../InstructionsStep/index';
import './instructions.css';

const instructionSteps = [
  'We\'ll check in with you every 30 minutes.',
  'Date going really well? Disable anytime!',
  'If we haven\'t heard from you for too long, we\'ll get in touch with your SOS!',
  'Your date\'s number is only shared with anyone as a last resort.',
]

class Instructions extends Component {

  render() {
    return (
      <div className='instructions-container'>
        {instructionSteps.map((step, idx) => (
          <InstructionsStep key={idx} step={step}/>
        ))}
      </div>
    );
  }
}

export default Instructions;
