import React from 'react';
import './instructionstep.css';

const InstructionsStep = ({step, img}) => {
  return (
    <div className='instruction-step'>
      <div className='instruction-step-image'>
        <img src={img} alt='' />
      </div>
      <div className='instruction-step-text'>
        {step}
      </div>
    </div>
  );
}

export default InstructionsStep;
