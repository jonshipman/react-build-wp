import React from 'react';

const ResponsiveVideo = (props) => (
  <div className="resp-video">
    <video autoPlay loop muted>
      {props.sourceMp4 &&
        <source src={props.sourceMp4} type="video/mp4" />
      }

      {props.sourceWebm &&
        <source src={props.sourceWebm} type="video/webm" />
      }
    </video>
  </div>
);

export default ResponsiveVideo;
