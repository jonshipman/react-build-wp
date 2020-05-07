import React from 'react';

export default props => {
  return <>{`Error: ${props.error || ''}`}</>
}