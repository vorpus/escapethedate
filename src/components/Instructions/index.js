import React, { Component } from 'react';
import InstructionsStep from '../InstructionsStep/index';
import './instructions.css';

const instructionSteps = {
  1: {
    body: 'We\'ll check in with you every 30 minutes.',
    image: require('./hey.png'),
  },
  2: {
    body: 'Date going really well? Disable anytime!',
    image: require('./thinking.png'),
  },
  3: {
    body: 'If we haven\'t heard from you for too long, we\'ll get in touch with your SOS!',
    image: require('./help.png'),
  },
  4: {
    body: 'Your date\'s number is only shared with anyone as a last resort.',
    image: require('./bomb.png'),
  },
}

class Instructions extends Component {

  render() {
    return (
      <div className='instructions-container'>
        {Object.keys(instructionSteps).map((key, idx) => (
          <InstructionsStep key={key} img={instructionSteps[key].image} step={instructionSteps[key].body}/>
        ))}
      </div>
    );
  }
}

export default Instructions;
