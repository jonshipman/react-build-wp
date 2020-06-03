import React from 'react';

export default props => (
  <style
      type="text/css"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: props.style }}
    />
);
