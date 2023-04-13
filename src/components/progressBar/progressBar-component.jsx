import React, { useState, useEffect } from 'react';

import './progressBar-styles.css';

function ProgressBar(props) {
  const { total, current } = props;

  const [width, setWidth] = useState('0%');

  /* ProgressBar receives the sum of decks/cards (total) which determines the amount of circles/steps. it also receives the current value of decks/cards, which determines the length of progress bar
   */

  useEffect(() => {
    if (current === 0) {
      setWidth('0%');
    } else {
      setWidth((((current - 1) / (total - 1)) * 100).toFixed(2) + '%');
    }
  }, [total, current]);

  const circles = [];

  for (let i = 1; i <= total; i++) {
    const isActive = i <= current;
    const circleClass = isActive ? 'circle progressbar-active' : 'circle';
    circles.push(<div key={i} className={circleClass} />);
  }

  return (
    <div className="progressbar-container">
      <div className="progress-container">
        <div className="progress" id="progress" style={{ width }}></div>
        {circles}
      </div>
    </div>
  );
}

export default ProgressBar;
