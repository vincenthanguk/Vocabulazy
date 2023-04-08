import React from 'react';

import './loadingSpinner-styles.css';

function LoadingSpinner() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingSpinner;
