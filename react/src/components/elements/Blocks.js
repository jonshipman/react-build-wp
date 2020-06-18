import React from 'react';

import PageWidth from './PageWidth';

const cellClassNames = 'w-100 relative';
const padding = 'pa4-l pa2';
const negativeMargins = 'nl4-l nr4-l';
const columns = {
	three: 'w-third-l',
	two: 'w-50-l'
};

const Loop = ({ className, items, children }) => (
  items.map(item => (
    <div key={JSON.stringify(item)} className={`${className || ''} ${cellClassNames}`}>
      {children(item)}
    </div>
  ))
);

const Static = ({ className, left, middle, right }) => (
  <>
    <div className={`${className || ''} ${cellClassNames}`}>
      {left}
    </div>

		{middle && (
			<div className={`${className || ''} ${cellClassNames}`}>
				{middle}
			</div>
		)}

    <div className={`${className || ''} ${cellClassNames}`}>
      {right}
    </div>
  </>
);

export const BlocksThreeFull = ({
  flexClassName,
  className,
  left,
  middle,
  right,
  children,
  items,
  ...rest
}) => (
  <div className={`blocks-three-full ${(className || '')}`}>
    <div className={`flex-l ${flexClassName || ''}`} { ...rest }>
      {left || middle || right
        ? Static({ className: columns.three, left, middle, right })
        : Loop({ className: columns.three, items, children })
      }
    </div>
  </div>
);

export const BlocksThree = ({
  flexClassName,
  className,
  left,
  middle,
  right,
  children,
  items,
  ...rest
}) => (
  <PageWidth className={`blocks-three ${(className || '')}`}>
    <div className={`flex-l ${negativeMargins} ${flexClassName || ''}`} { ...rest }>
      {left || middle || right
        ? Static({ className: `${padding} ${columns.three}`, left, middle, right })
        : Loop({ className: `${padding} ${columns.three}`, items, children })
      }
    </div>
  </PageWidth>
);

export const BlocksTwoFull = ({
  flexClassName,
  className,
  left,
  right,
  children,
  items,
  ...rest
}) => (
  <div className={`blocks-two-full ${(className || '')}`}>
    <div className={`flex-l ${flexClassName || ''}`} { ...rest }>
      {left || right
        ? Static({ className: columns.two, left, right })
        : Loop({ className: columns.two, items, children })
      }
    </div>
  </div>
);

export const BlocksTwo = ({
  flexClassName,
  className,
  left,
  right,
  children,
  items,
  ...rest
}) => (
  <PageWidth className={`blocks-two ${(className || '')}`}>
    <div className={`flex-l ${negativeMargins} ${flexClassName || ''}`} { ...rest }>
      {left || right
        ? Static({ className: `${padding} ${columns.two}`, left, right })
        : Loop({ className: `${padding} ${columns.two}`, items, children })
      }
    </div>
  </PageWidth>
);