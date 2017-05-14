import React from 'react';
import './instructionstep.css';

const InstructionsStep = ({step}) => {
  return (
    <div className='instruction-step'>
      {step}
    </div>
  );
}

export default InstructionsStep;
