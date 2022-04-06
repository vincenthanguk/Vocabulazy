import React from 'react';
import './flashMessage-styles.css';

function FlashMessage(props) {
  const { flash } = props;
  return <div className={flash.style}> {flash.message}</div>;
}

export default FlashMessage;
