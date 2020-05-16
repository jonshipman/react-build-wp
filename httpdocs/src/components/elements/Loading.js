import React from 'react';

export default props => {
  return <span { ...props }><span className="lds-ring"><span></span><span></span><span></span><span></span></span></span>
}